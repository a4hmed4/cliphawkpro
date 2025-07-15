#!/usr/bin/env python3
"""
Optimized server runner for Windows to avoid asyncio connection errors
"""

import sys
import os
import asyncio
import warnings
import logging
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

# Suppress all asyncio warnings
warnings.filterwarnings("ignore", category=DeprecationWarning, module="asyncio")
warnings.filterwarnings("ignore", message=".*_ProactorBasePipeTransport.*")
warnings.filterwarnings("ignore", message=".*ProactorBasePipeTransport.*")

# Configure logging to reduce noise
logging.basicConfig(
    level=logging.WARNING,
    format='%(levelname)s: %(message)s'
)

# Suppress specific loggers
logging.getLogger("asyncio").setLevel(logging.ERROR)
logging.getLogger("uvicorn").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.ERROR)

def setup_windows_asyncio():
    """Setup asyncio for Windows to avoid connection errors"""
    if sys.platform == "win32":
        # Use selector event loop instead of proactor
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
        # Custom exception handler to suppress connection errors
        def custom_exception_handler(loop, context):
            exception = context.get('exception')
            if exception and isinstance(exception, ConnectionResetError):
                # Ignore connection reset errors
                return
            if "ProactorBasePipeTransport" in str(context):
                # Ignore proactor transport errors
                return
            # Log other exceptions
            print(f"Error: {context}")
        
        # Set the custom exception handler
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.set_exception_handler(custom_exception_handler)
        except Exception as e:
            print(f"Warning: Could not set custom exception handler: {e}")

def main():
    """Main function to run the server"""
    print("Starting ClipHawk Backend Server (Windows Optimized)...")
    
    # Setup Windows-specific asyncio
    setup_windows_asyncio()
    
    try:
        import uvicorn
        from main import app
        
        print("Server will be available at: http://localhost:8000")
        print("Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Run with optimized settings
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            log_level="warning",
            access_log=False,
            loop="asyncio",
            timeout_keep_alive=5,
            timeout_graceful_shutdown=10,
            limit_concurrency=50,
            limit_max_requests=500,
            backlog=1024,
            use_colors=False
        )
        
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 