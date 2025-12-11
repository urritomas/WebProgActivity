function performReplaceAll() {
    const text = document.getElementById('replaceall-text').value;

    if (!text) {
        alert('Please enter some text');
        return;
    }

    const result = replaceAll(text, ' ', '');
    const spacesRemoved = (text.match(/ /g) || []).length;

    document.getElementById('replaceall-output').value = result;
    document.getElementById('replaceall-info').textContent = 
        `✓ Removed ${spacesRemoved} space(s)`;
    document.getElementById('replaceall-result').style.display = 'block';
}

function replaceAll(text, find, replace) {
    if (!find) return text;
    
    let result = text;
    let lastIndex = 0;
    let newText = '';
    
    while (true) {
        const index = result.indexOf(find, lastIndex);
        if (index === -1) {
            newText += result.substring(lastIndex);
            break;
        }
        newText += result.substring(lastIndex, index) + replace;
        lastIndex = index + find.length;
    }
    
    return newText;
}

function performSearchWord() {
    const text = document.getElementById('searchword-text').value;
    const search = document.getElementById('searchword-search').value;

    if (!text || !search) {
        alert('Please enter both text and search term');
        return;
    }

    const result = searchWord(text, search);
    
    let highlighted = text;
    const regex = new RegExp(`\\b${search}\\b`, 'gi');
    highlighted = highlighted.replace(regex, match => `[${match}]`);

    document.getElementById('searchword-output').innerHTML = 
        `<strong>Found ${result.count} match(es)</strong><br>Positions: ${result.positions.join(', ')}`;
    document.getElementById('searchword-highlighted').value = highlighted;
    document.getElementById('searchword-result').style.display = 'block';
}

function searchWord(text, search) {
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();
    const positions = [];
    let count = 0;
    
    const words = text.split(/\s+/);
    let charIndex = 0;
    
    for (let word of words) {
        const wordClean = word.replace(/[^\w]/g, '');
        
        if (wordClean.toLowerCase() === searchLower) {
            positions.push(charIndex);
            count++;
        }
        charIndex += word.length + 1;
    }
    
    return { count, positions };
}

function performReplaceWord() {
    const text = document.getElementById('replaceword-text').value;
    const find = document.getElementById('replaceword-find').value;
    const replace = document.getElementById('replaceword-replace').value;

    if (!text || !find) {
        alert('Please enter both text and word to replace');
        return;
    }

    const result = replaceWord(text, find, replace);

    document.getElementById('replaceword-output').value = result;
    
    const count = (text.match(new RegExp(`\\b${escapeRegExp(find)}\\b`, 'gi')) || []).length;
    document.getElementById('replaceword-info').textContent = 
        `✓ Replaced ${count} occurrence(s) of word "${find}"`;
    document.getElementById('replaceword-result').style.display = 'block';
}

function replaceWord(text, find, replace) {
    if (!find) return text;
    
    const regex = new RegExp(`\\b${escapeRegExp(find)}\\b`, 'gi');
    return text.replace(regex, replace);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function performCountCharacters() {
    const text = document.getElementById('countchars-text').value;

    if (!text) {
        alert('Please enter some text to analyze');
        return;
    }

    const stats = countCharacters(text);

    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-letters').textContent = stats.letters;
    document.getElementById('stat-digits').textContent = stats.digits;
    document.getElementById('stat-spaces').textContent = stats.spaces;
    document.getElementById('stat-special').textContent = stats.special;
    document.getElementById('stat-upper').textContent = stats.uppercase;
    document.getElementById('stat-lower').textContent = stats.lowercase;
    document.getElementById('stat-words').textContent = stats.words;
    
    document.getElementById('countchars-result').style.display = 'block';
}

function countCharacters(text) {
    let letters = 0;
    let digits = 0;
    let spaces = 0;
    let special = 0;
    let uppercase = 0;
    let lowercase = 0;
    
    for (let char of text) {
        if (/[a-zA-Z]/.test(char)) {
            letters++;
            if (/[A-Z]/.test(char)) {
                uppercase++;
            } else {
                lowercase++;
            }
        } else if (/[0-9]/.test(char)) {
            digits++;
        } else if (/\s/.test(char)) {
            spaces++;
        } else {
            special++;
        }
    }
    
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    return {
        total: text.length,
        letters,
        digits,
        spaces,
        special,
        uppercase,
        lowercase,
        words
    };
}

function performEmailCheck() {
    const email = document.getElementById('emailcheck-input').value;

    if (!email) {
        alert('Please enter an email address');
        return;
    }

    const result = emailCheck(email);
    const resultDiv = document.getElementById('emailcheck-output');
    const detailsDiv = document.getElementById('emailcheck-details');

    if (result.valid) {
        resultDiv.className = 'email-result valid';
        resultDiv.textContent = '✓ Valid Email Address';
    } else {
        resultDiv.className = 'email-result invalid';
        resultDiv.textContent = '✗ Invalid Email Address';
    }

    let details = '<p><strong>Validation Checks:</strong></p>';
    details += `<p>✓ Has @ symbol: ${result.hasAt ? 'Yes' : 'No'}</p>`;
    details += `<p>✓ Has valid local part: ${result.hasValidLocal ? 'Yes' : 'No'}</p>`;
    details += `<p>✓ Has valid domain: ${result.hasValidDomain ? 'Yes' : 'No'}</p>`;
    details += `<p>✓ Has valid TLD: ${result.hasValidTld ? 'Yes' : 'No'}</p>`;
    
    if (result.errorMessage) {
        details += `<p style="color: #721c24;"><strong>Error:</strong> ${result.errorMessage}</p>`;
    }
    
    detailsDiv.innerHTML = details;
    document.getElementById('emailcheck-result').style.display = 'block';
}

function emailCheck(email) {
    let valid = true;
    let errorMessage = '';
    let hasAt = false;
    let hasValidLocal = false;
    let hasValidDomain = false;
    let hasValidTld = false;
    
    const trimmed = email.trim();
    
    if (trimmed.includes(' ')) {
        valid = false;
        errorMessage = 'Email cannot contain spaces';
    }
    
    const atCount = (trimmed.match(/@/g) || []).length;
    if (atCount === 0) {
        valid = false;
        errorMessage = 'Email must contain @ symbol';
    } else if (atCount > 1) {
        valid = false;
        errorMessage = 'Email cannot contain multiple @ symbols';
    } else {
        hasAt = true;
    }
    
    const parts = trimmed.split('@');
    const localPart = parts[0];
    const domainPart = parts[1];
    
    if (localPart && localPart.length > 0 && !localPart.startsWith('.') && !localPart.endsWith('.')) {
        if (/^[a-zA-Z0-9._-]+$/.test(localPart)) {
            hasValidLocal = true;
        } else {
            valid = false;
            errorMessage = 'Invalid characters in local part (before @)';
        }
    } else {
        valid = false;
        errorMessage = 'Local part cannot be empty or start/end with a dot';
    }
    
    if (domainPart) {
        const domainParts = domainPart.split('.');
        
        if (domainParts.length < 2) {
            valid = false;
            errorMessage = 'Domain must contain at least one dot';
        } else {
            hasValidDomain = true;
            
            const tld = domainParts[domainParts.length - 1];
            if (tld.length >= 2 && /^[a-zA-Z]+$/.test(tld)) {
                hasValidTld = true;
            } else {
                valid = false;
                errorMessage = 'Invalid TLD (top-level domain)';
            }
            
            if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) {
                valid = false;
                errorMessage = 'Invalid characters in domain';
            }
            
            if (domainPart.includes('..')) {
                valid = false;
                errorMessage = 'Domain cannot contain consecutive dots';
            }
        }
    } else {
        valid = false;
        errorMessage = 'Domain is missing';
    }
    
    return {
        valid: valid && hasAt && hasValidLocal && hasValidDomain && hasValidTld,
        hasAt,
        hasValidLocal,
        hasValidDomain,
        hasValidTld,
        errorMessage
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});