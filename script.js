 // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        // DOM Elements
        const imageUpload = document.getElementById('imageUpload');
        const uploadTrigger = document.getElementById('uploadTrigger');
        const previewImage = document.getElementById('previewImage');
        const imagePreview = document.getElementById('imagePreview');
        const removeBgBtn = document.getElementById('removeBgBtn');
        const changeColorBtn = document.getElementById('changeColorBtn');
        const colorOptions = document.querySelectorAll('.color-option');
        const customColor = document.getElementById('customColor');
        const resultImage = document.getElementById('resultImage');
        const resultContainer = document.getElementById('resultContainer');
        const downloadBtn = document.getElementById('downloadBtn');
        const previewLoader = document.getElementById('previewLoader');
        const resultLoader = document.getElementById('resultLoader');

        // Variables
        let originalImage = null;
        let currentBackground = 'changeColor';
        let selectedColor = '#ffffff';

        // Event Listeners
        uploadTrigger.addEventListener('click', () => imageUpload.click());
        imageUpload.addEventListener('change', handleImageUpload);
        removeBgBtn.addEventListener('click', () => toggleBackgroundOption('remove'));
        changeColorBtn.addEventListener('click', () => toggleBackgroundOption('changeColor'));
        customColor.addEventListener('input', handleCustomColor);
        downloadBtn.addEventListener('click', downloadImage);

        // Add event listeners to color options
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                selectedColor = option.getAttribute('data-color');
                updateResultImage();
            });
        });

        // Functions
        function handleImageUpload(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            
            // Show loader
            previewLoader.style.display = 'block';
            imagePreview.querySelector('.upload-icon').style.display = 'none';
            imagePreview.querySelector('.upload-text').style.display = 'none';
            
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                previewImage.style.display = 'block';
                originalImage = event.target.result;
                
                // Hide loader after a short delay to simulate processing
                setTimeout(() => {
                    previewLoader.style.display = 'none';
                    updateResultImage();
                    downloadBtn.disabled = false;
                }, 800);
            };
            
            reader.readAsDataURL(file);
        }

        function toggleBackgroundOption(option) {
            currentBackground = option;
            
            if (option === 'remove') {
                removeBgBtn.classList.add('active');
                changeColorBtn.classList.remove('active');
                document.getElementById('colorOptions').style.opacity = '0.5';
                document.getElementById('colorOptions').style.pointerEvents = 'none';
            } else {
                changeColorBtn.classList.add('active');
                removeBgBtn.classList.remove('active');
                document.getElementById('colorOptions').style.opacity = '1';
                document.getElementById('colorOptions').style.pointerEvents = 'all';
            }
            
            updateResultImage();
        }

        function handleCustomColor(e) {
            selectedColor = e.target.value;
            updateResultImage();
        }

        function updateResultImage() {
            if (!originalImage) return;
            
            // Show loader
            resultLoader.style.display = 'block';
            resultContainer.querySelector('.result-placeholder').style.display = 'none';
            
            // Simulate processing delay
            setTimeout(() => {
                resultImage.src = originalImage;
                resultImage.style.display = 'block';
                
                // Apply background effect based on selection
                if (currentBackground === 'remove') {
                    // In a real app, this would use a background removal API
                    // For this demo, we'll just add a checkerboard pattern to simulate transparency
                    resultContainer.style.backgroundImage = 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)';
                    resultContainer.style.backgroundSize = '20px 20px';
                    resultContainer.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
                } else {
                    resultContainer.style.background = selectedColor;
                    resultContainer.style.backgroundImage = 'none';
                }
                
                // Hide loader
                resultLoader.style.display = 'none';
            }, 800);
        }

        function downloadImage() {
            if (!resultImage.src) return;
            
            // Create a temporary canvas to draw the image with the background
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Draw background if not transparent
                if (currentBackground === 'changeColor') {
                    ctx.fillStyle = selectedColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else {
                    // For transparent background, we leave it transparent
                    // In a real implementation, we would use a PNG with transparency
                }
                
                // Draw the image
                ctx.drawImage(img, 0, 0);
                
                // Create download link
                const link = document.createElement('a');
                link.download = 'edited-image.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            
            img.src = originalImage;
        }