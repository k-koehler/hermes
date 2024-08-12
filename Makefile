# Determine the operating system
UNAME_S := $(shell uname -s)
# Set variables based on the OS
ifeq ($(UNAME_S),Darwin)
    # macOS
    INSTALL_CMD := brew install transmission-cli ffmpeg
    START_DAEMON_CMD := transmission-daemon
    STOP_CMD := killall transmission-daemon 2>/dev/null || true
    STATUS_CMD := pgrep -l transmission-daemon
    CHECK_INSTALLED := command -v transmission-daemon
    CHECK_FFMPEG := command -v ffmpeg
else
    # Assume Linux
    INSTALL_CMD := sudo apt-get update && sudo apt-get install -y transmission-daemon ffmpeg
    START_DAEMON_CMD := sudo service transmission-daemon start
    STOP_CMD := sudo service transmission-daemon stop
    STATUS_CMD := sudo service transmission-daemon status
    CHECK_INSTALLED := command -v transmission-daemon
    CHECK_FFMPEG := command -v ffmpeg
endif

.PHONY: install start-daemon stop restart status run help

install:
	@echo "Checking if Transmission daemon and FFmpeg are installed..."
	@if $(CHECK_INSTALLED) >/dev/null 2>&1 && $(CHECK_FFMPEG) >/dev/null 2>&1; then \
		echo "Transmission daemon and FFmpeg are already installed."; \
	else \
		echo "Installing Transmission daemon and FFmpeg..."; \
		$(INSTALL_CMD); \
	fi

start-daemon:
	@echo "Starting Transmission daemon..."
	@$(START_DAEMON_CMD)

stop:
	@echo "Stopping Transmission daemon..."
	@$(STOP_CMD)

restart: stop start-daemon

status:
	@echo "Checking Transmission daemon status..."
	@$(STATUS_CMD)

prep:
	@echo "Checking Transmission daemon and FFmpeg installation..."
	@if ! $(CHECK_INSTALLED) >/dev/null 2>&1 || ! $(CHECK_FFMPEG) >/dev/null 2>&1; then \
		echo "Transmission daemon or FFmpeg not found. Installing..."; \
		$(INSTALL_CMD); \
	fi
	@echo "Stopping any running instances of Transmission daemon..."
	@$(STOP_CMD)
	@echo "Installing npm packages..."
	npm install
	@echo "Starting Transmission daemon..."
	@$(START_DAEMON_CMD)

run: prep
	@echo "Starting Node.js server..."
	npm run start

dev: prep
	@echo "Starting Node.js server in development mode..."
	npm run dev

help:
	@echo "Hermes"
	@echo "-------------------------------------------------"
	@echo "make install : Install Transmission daemon and FFmpeg (if not already installed)"
	@echo "make start-daemon: Start the Transmission daemon"
	@echo "make stop : Stop the Transmission daemon"
	@echo "make restart : Restart the Transmission daemon"
	@echo "make status : Check Transmission daemon status"
	@echo "make run : Ensure daemon and FFmpeg are installed, stop if running, install npm packages, start daemon, and run Node.js server"

# Default target
all: help