export const compressVideo = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
  
      video.onloadedmetadata = () => {
        const { videoWidth, videoHeight } = video;
        
        // Aggressive size reduction for 1MB target
        const maxDimension = 480;
        const scale = Math.min(maxDimension / videoWidth, maxDimension / videoHeight);
        
        canvas.width = Math.floor(videoWidth * scale);
        canvas.height = Math.floor(videoHeight * scale);
  
        const stream = canvas.captureStream(15); // 15 FPS
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: 200000 // 200kbps for 1MB target
        });
  
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const compressedBlob = new Blob(chunks, { type: 'video/webm' });
          resolve(new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '.webm'), {
            type: 'video/webm'
          }));
        };
  
        mediaRecorder.start();
        video.currentTime = 0;
        video.play();
  
        const drawFrame = () => {
          if (!video.ended && !video.paused) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawFrame);
          } else {
            mediaRecorder.stop();
          }
        };
  
        video.onended = () => mediaRecorder.stop();
        drawFrame();
      };
  
      video.onerror = () => reject(new Error('Video processing failed'));
      video.src = URL.createObjectURL(file);
    });
  };