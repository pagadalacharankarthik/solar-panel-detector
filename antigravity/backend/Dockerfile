FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (needed for opencv and potential build tools)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Create artifacts directory
RUN mkdir -p artifacts

COPY . .

# Expose port
EXPOSE 8000

# Run FastAPI with Reload for easy dev, or standard command
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
