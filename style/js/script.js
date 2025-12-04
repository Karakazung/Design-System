// Initialize Icons
lucide.createIcons();

// DOM Content Loaded Logic
document.addEventListener('DOMContentLoaded', () => {
    const viewers = document.querySelectorAll('.component-viewer');
    viewers.forEach(section => {
        const title = section.getAttribute('data-title') || 'Component';
        const originalContent = section.innerHTML;
        
        // Robust HTML Formatter
        let formattedCode = '';
        try {
            formattedCode = formatHTML(originalContent);
        } catch (e) {
            formattedCode = originalContent; // Fallback
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-card';
        wrapper.innerHTML = `
            <div class="bg-surface-variant border-b border-outline-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 class="text-sm font-bold text-on-surface flex items-center gap-2 uppercase tracking-wider"><i data-lucide="component" class="w-4 h-4 text-on-surface-variant"></i> ${title}</h3>
                <div class="view-toggle"><button class="active" onclick="toggleView(this, 'preview')"><i data-lucide="eye" class="w-3 h-3"></i> Preview</button><button onclick="toggleView(this, 'code')"><i data-lucide="code" class="w-3 h-3"></i> Code</button></div>
            </div>
            <div class="p-8 bg-surface border-b border-outline-variant"><div class="preview-area flex justify-center items-center w-full overflow-x-auto"><div class="w-full max-w-4xl">${originalContent}</div></div><div class="code-block hidden">${escapeHTML(formattedCode)}</div></div>
        `;
        section.innerHTML = '';
        section.appendChild(wrapper);
    });
    // Re-run icons for dynamically added content
    lucide.createIcons();
});

// Toggle View Function
window.toggleView = function(btn, mode) {
    const container = btn.closest('.component-viewer');
    const toggleButtons = container.querySelectorAll('.view-toggle button');
    const previewArea = container.querySelector('.preview-area');
    const codeBlock = container.querySelector('.code-block');
    toggleButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (mode === 'preview') { previewArea.classList.remove('hidden'); codeBlock.classList.remove('active'); } else { previewArea.classList.add('hidden'); codeBlock.classList.add('active'); }
};

// Helpers
function escapeHTML(str) { return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }

function formatHTML(html) {
    let indent = 0; 
    const tab = '  '; 
    let formatted = '';
    
    // Normalize
    html = html.replace(/[\r\n]+|\s\s+/g, ' ').trim();
    // Tokenize tags and content
    const tokens = html.match(/<[^>]+>|[^<]+/g) || [];
    
    tokens.forEach(function(token) {
        token = token.trim();
        if (!token) return;
        
        if (token.match(/^<\/\w/)) { 
            indent = Math.max(0, indent - 1); 
        }
        
        formatted += new Array(indent + 1).join(tab) + token + '\n';
        
        if (token.match(/^<\w/) && !token.match(/\/>$/) && !token.startsWith('<!')) { 
            // Simple check for void tags
            const tagMatch = token.match(/^<([a-z0-9]+)/i);
            if (tagMatch) {
                 const tagName = tagMatch[1].toLowerCase();
                 if (!['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tagName)) {
                     indent++; 
                 }
            }
        }
    });
    return formatted.trim();
}