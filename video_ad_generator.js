// Ensure all navigation and template functions are globally available
window.showVideoAdGenerator = showVideoAdGenerator;
window.selectVideoTemplate = selectVideoTemplate;
window.generateVideoAd = generateVideoAd;
window.exportVideoToPPTX = exportVideoToPPTX;
window.addCustomTemplate = typeof addCustomTemplate !== 'undefined' ? addCustomTemplate : undefined;
function showVideoAdGenerator() {
    document.getElementById('main-content').innerHTML = `
        <h2>Video Ad Generator</h2>
        <form id="video-ad-form" onsubmit="generateVideoAd(event)">
            <label>Ad Title:<br><input type="text" id="ad-title" required></label><br><br>
            <label>Ad Description:<br><textarea id="ad-desc" required></textarea></label><br><br>
            <label>Background Color:<br><input type="color" id="ad-bg" value="#ffffff"></label><br><br>
            <label>Duration (seconds):<br><input type="number" id="ad-duration" min="1" max="60" value="10" required></label><br><br>
            <label>Design Template:<br>
                <div class="template-gallery" id="template-gallery">
                    <div class="template-category">Popular</div>
                    <div class="template-option canva-modern" onclick="selectVideoTemplate('modern')" id="template-modern">
                        <div class="template-thumb canva-modern-thumb"></div>
                        <span>Modern</span>
                    </div>
                    <div class="template-option canva-minimal" onclick="selectVideoTemplate('minimal')" id="template-minimal">
                        <div class="template-thumb canva-minimal-thumb"></div>
                        <span>Minimal</span>
                    </div>
                    <div class="template-option canva-corporate" onclick="selectVideoTemplate('corporate')" id="template-corporate">
                        <div class="template-thumb canva-corporate-thumb"></div>
                        <span>Corporate</span>
                    </div>
                    <div class="template-option canva-fun" onclick="selectVideoTemplate('fun')" id="template-fun">
                        <div class="template-thumb canva-fun-thumb"></div>
                        <span>Fun</span>
                    </div>
                    <div class="template-option canva-elegant" onclick="selectVideoTemplate('elegant')" id="template-elegant">
                        <div class="template-thumb canva-elegant-thumb"></div>
                        <span>Elegant</span>
                    </div>
                </div>
                <button type="button" id="add-template-btn" style="margin-top:0.5em;">+ Add Your Own Template</button>
                <input type="hidden" id="ad-template" value="modern">
            </label><br>
            <button type="submit">Generate Video Ad</button>
        </form>
        <div id="video-ad-result" style="margin-top:2em;"></div>
    `;
    // Set default selected template
    document.getElementById('template-modern').classList.add('selected-template');
    // Add handler for custom template
    document.getElementById('add-template-btn').onclick = function() {
        const name = prompt('Enter a name for your template:');
        if (!name) return;
        const color = prompt('Enter a background color (hex, e.g. #ffcc00):', '#ffffff');
        if (!color) return;
        // Add new template button
        const gallery = document.getElementById('template-gallery');
        const id = 'template-' + name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const div = document.createElement('div');
        div.className = 'template-option custom-template';
        div.id = id;
        div.textContent = name;
        div.style.background = color;
        div.onclick = function() { selectVideoTemplate(id.replace('template-', '')); };
        gallery.appendChild(div);
        // Store color for export
        window.customVideoTemplates = window.customVideoTemplates || {};
        window.customVideoTemplates[name.toLowerCase().replace(/[^a-z0-9]/g, '')] = color;
    };
window.selectVideoTemplate = selectVideoTemplate;
    window.generateVideoAd = generateVideoAd;
    window.exportVideoToPPTX = exportVideoToPPTX;
}

// Handle template selection
window.showVideoAdGenerator = showVideoAdGenerator;
function selectVideoTemplate(template) {
    document.getElementById('ad-template').value = template;
    // Remove selection from all
    document.querySelectorAll('.template-option').forEach(el => el.classList.remove('selected-template'));
    // Add selection to chosen
    const selected = document.getElementById('template-' + template);
    if (selected) selected.classList.add('selected-template');
}

async function generateVideoAd(event) {
    event.preventDefault();
    const title = document.getElementById('ad-title').value;
    const desc = document.getElementById('ad-desc').value;
    const bg = document.getElementById('ad-bg').value;
    const duration = document.getElementById('ad-duration').value;
    const template = document.getElementById('ad-template').value;
    document.getElementById('video-ad-result').innerHTML = '<p>Generating video ad...</p>';
    try {
        const response = await fetch('http://localhost:5000/generate_video_ad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, desc, bg, duration, template })
        });
        if (!response.ok) throw new Error('Failed to generate video ad');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        document.getElementById('video-ad-result').innerHTML = `
            <video id="generated-video" controls src="${url}" width="480" style="cursor:pointer;"></video><br>
            <a href="${url}" download="video_ad.mp4">Download Video Ad</a><br>
            <button id="export-pptx-btn" style="margin-top:1em;">Export to PowerPoint</button>
        `;
        // Add click event to video for interactivity
        const videoElem = document.getElementById('generated-video');
        if (videoElem) {
            videoElem.addEventListener('click', function() {
                if (videoElem.paused) {
                    videoElem.play();
                    videoElem.style.border = '4px solid #007bff';
                } else {
                    videoElem.pause();
                    videoElem.style.border = '2px dashed #aaa';
                }
            });
            // Initial border style
            videoElem.style.border = '2px dashed #aaa';
        }
        // Add export to PowerPoint functionality
        const exportBtn = document.getElementById('export-pptx-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', async function() {
                await exportVideoToPPTX(url, title, desc, template);
            });
        }
    // Export video ad to PowerPoint (PPTX) using PptxGenJS
    async function exportVideoToPPTX(videoUrl, title, desc, template) {
        // Load PptxGenJS if not already loaded
        if (typeof window.PptxGenJS === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/pptxgenjs@3.11.0/dist/pptxgen.bundle.js';
            document.head.appendChild(script);
            await new Promise(resolve => { script.onload = resolve; });
        }
        const pptx = new window.PptxGenJS();
        const slide = pptx.addSlide();
        // Template backgrounds
        const templateBg = {
            modern: { fill: { type: 'solid', color: 'F8FAFC' } },
            minimal: { fill: { type: 'solid', color: 'FFFFFF' } },
            corporate: { fill: { type: 'solid', color: 'E0E0E0' } },
            fun: { fill: { type: 'solid', color: 'FFE082' } },
            elegant: { fill: { type: 'solid', color: 'F3E8FF' } },
        };
        slide.background = templateBg[template] || { fill: { type: 'solid', color: 'FFFFFF' } };
        // Add title
        slide.addText(title, { x: 0.5, y: 0.3, w: 8, h: 0.7, fontSize: 32, bold: true, color: '222222' });
        // Add description
        slide.addText(desc, { x: 0.5, y: 1.1, w: 8, h: 1, fontSize: 18, color: '444444' });
        // Add video placeholder (PPTX can't embed video from blob, so add a placeholder and instructions)
        slide.addText('Video Preview:', { x: 0.5, y: 2.3, fontSize: 16, color: '007bff', bold: true });
        slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.7, w: 4.5, h: 2.5, fill: { color: '000000' }, line: { color: '007bff', width: 2 } });
        slide.addText('Download and insert the video manually in this area.', { x: 0.6, y: 3.1, w: 4.3, h: 1, fontSize: 14, color: 'ffffff', align: 'center' });
        // Add download link
        slide.addText('Download Video', { x: 5.2, y: 2.7, w: 2.5, h: 0.5, fontSize: 16, color: '007bff', hyperlink: { url: videoUrl } });
        // Save PPTX
        pptx.writeFile({ fileName: `${title.replace(/[^a-z0-9]/gi, '_')}_ad.pptx` });
    }
    } catch (err) {
        document.getElementById('video-ad-result').innerHTML = `<p style=\"color:red;\">Error: ${err.message}</p>`;
    }
}
