// Ensure all navigation and template functions are globally available
window.showGallery = showGallery;
window.showAI = showAI;
try { window.showVideoAdGenerator = showVideoAdGenerator; } catch(e) {}
try { window.selectVideoTemplate = selectVideoTemplate; } catch(e) {}
try { window.generateVideoAd = generateVideoAd; } catch(e) {}
try { window.exportVideoToPPTX = exportVideoToPPTX; } catch(e) {}
try { window.addCustomTemplate = addCustomTemplate; } catch(e) {}
function showGallery() {
    document.getElementById('main-content').innerHTML = `
        <h2>Choose a Pamphlet Template</h2>
        <div class="template-gallery">
            <div class="template-option canva-modern" onclick="selectTemplate('Modern')" id="pamphlet-modern">Modern</div>
            <div class="template-option canva-minimal" onclick="selectTemplate('Minimalist')" id="pamphlet-minimal">Minimalist</div>
            <div class="template-option canva-corporate" onclick="selectTemplate('Corporate')" id="pamphlet-corporate">Corporate</div>
            <div class="template-option canva-fun" onclick="selectTemplate('Fun')" id="pamphlet-fun">Fun</div>
            <div class="template-option canva-elegant" onclick="selectTemplate('Elegant')" id="pamphlet-elegant">Elegant</div>
        </div>
        <div id="template-editor" style="margin-top:2em;"></div>
    `;
    // Set default selected template
    document.getElementById('pamphlet-modern').classList.add('selected-template');
    window.currentPamphletTemplate = 'Modern';
}

function selectTemplate(name) {
    window.currentPamphletTemplate = name;
    document.querySelectorAll('.template-option').forEach(el => el.classList.remove('selected-template'));
    const selected = document.getElementById('pamphlet-' + name.toLowerCase());
    if (selected) selected.classList.add('selected-template');
    document.getElementById('template-editor').innerHTML = `
        <h3>Editing: ${name} Pamphlet</h3>
        <form id="pamphlet-form" onsubmit="savePamphlet(event, '${name}')">
            <label>Title:<br><input type="text" id="pamphlet-title" value="${name} Pamphlet"></label><br><br>
            <label>Content:<br><textarea id="pamphlet-content" rows="5">Enter your pamphlet content here...</textarea></label><br><br>
            <button type="submit">Save Pamphlet</button>
        </form>
        <div id="pamphlet-preview" class="pamphlet-preview ${'canva-' + name.toLowerCase()}"></div>
    `;
    // Live preview update
    document.getElementById('pamphlet-title').addEventListener('input', updatePamphletPreview);
    document.getElementById('pamphlet-content').addEventListener('input', updatePamphletPreview);
    updatePamphletPreview();
}

function updatePamphletPreview() {
    const title = document.getElementById('pamphlet-title').value;
    const content = document.getElementById('pamphlet-content').value;
	const preview = document.getElementById('pamphlet-preview');
	if (preview) {
		preview.innerHTML = `<div class='pamphlet-title'>${title}</div><div class='pamphlet-content'>${content}</div>`;
	}
}


function savePamphlet(event, name) {
    event.preventDefault();
    const title = document.getElementById('pamphlet-title').value;
    const content = document.getElementById('pamphlet-content').value;
    document.getElementById('pamphlet-result').innerHTML = `<p><b>${title}</b> saved!<br>Content: ${content}</p>`;
}

function showAI() {
    document.getElementById('main-content').innerHTML = `
        <h2>AI Assistant</h2>
        <div class="chat-container">
            <div id="chat-history" class="chat-history"></div>
            <div class="chat-input-row">
                <input type="text" id="ai-input" placeholder="Type your message..." style="width:70%;">
                <button onclick="askAI()">Send</button>
            </div>
        </div>
    `;
    window.chatHistory = [];
    renderChatHistory();
}

function askAI() {
    const input = document.getElementById('ai-input').value.trim();
    if (!input) return;
    window.chatHistory = window.chatHistory || [];
    window.chatHistory.push({ sender: 'user', text: input });
    let response = '';
    const lower = input.toLowerCase();
    if (lower.includes('video ad') || lower.includes('generate ad')) {
        response = 'Opening the Video Ad Generator for you...\n\nTip: Try our new design templates for a modern, fun, or elegant look!';
        window.chatHistory.push({ sender: 'ai', text: response });
        renderChatHistory();
        setTimeout(() => showVideoAdGenerator(), 1000);
        return;
    } else if (lower.includes('pamphlet') || lower.includes('pamplet') || lower.includes('pamflet')) {
        response = 'Opening the Pamphlet Templates Gallery for you...\n\nTip: You can customize the title, content, and style. Want a catchy slogan? Just ask!';
        window.chatHistory.push({ sender: 'ai', text: response });
        renderChatHistory();
        setTimeout(() => showGallery(), 1000);
        return;
    } else if (lower.includes('publish') || lower.includes('appstore') || lower.includes('playstore')) {
        response = 'To publish your app, you can convert this web app into a Progressive Web App (PWA) for mobile stores, or deploy it as a website using platforms like Vercel, Netlify, or GitHub Pages.';
    } else if (lower.includes('about') || lower.includes('what can you do')) {
        response = 'I am your AI assistant!\n\nI can help you create ads, pamphlets, generate creative slogans, suggest design ideas, and guide you through using this app.\n\nJust type your request below!';
    } else if (lower.includes('slogan')) {
        response = 'Here are some catchy slogans for your ad:\n- Stand Out. Shine Bright.\n- Your Brand, Your Story.\n- Make Every Second Count.\n- Creativity Unleashed.';
    } else if (lower.includes('design') || lower.includes('template')) {
        response = 'Try our new design templates:\n- Modern\n- Minimal\n- Corporate\n- Fun\n- Elegant\n\nSelect one in the Video Ad Generator for a unique look.';
    } else if (lower.includes('powerpoint') || lower.includes('pptx')) {
        response = 'You can now export your video ad as a PowerPoint slide!\nAfter generating a video, click the Export to PowerPoint button.';
    } else if (lower.includes('idea')) {
        response = 'Here are some creative ad ideas:\n- Use a bold color background for attention.\n- Add a call-to-action at the end.\n- Try the "Fun" template for playful brands.\n- Keep text short and impactful.';
    } else {
        response = 'I can help you with ads, pamphlets, video ad generation, design ideas, slogans, and exporting to PowerPoint.\n\nTry asking about any of these topics!';
    }
    window.chatHistory.push({ sender: 'ai', text: response });
    renderChatHistory();
    document.getElementById('ai-input').value = '';
}

function renderChatHistory() {
    const history = window.chatHistory || [];
    const chatDiv = document.getElementById('chat-history');
    if (!chatDiv) return;
    chatDiv.innerHTML = history.map(msg => {
        if (msg.sender === 'user') {
            return `<div class="chat-bubble user-bubble">${msg.text.replace(/\n/g, '<br>')}</div>`;
        } else {
            return `<div class="chat-bubble ai-bubble">${msg.text.replace(/\n/g, '<br>')}</div>`;
        }
    }).join('');
    chatDiv.scrollTop = chatDiv.scrollHeight;
}
}

// Make navigation functions globally available
window.showGallery = showGallery;
window.showAI = showAI;
// Default view
showGallery();
