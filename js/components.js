

// Helper to refresh Lucide icons
function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Helper to escape HTML tags to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Global UI Rendering Module
const GameUI = {
    // 1. Render character stats sidebar & indicators
    renderStats(state) {
        const char = state.character;
        
        // General text elements
        document.getElementById('char-name').innerText = char.name;
        document.getElementById('char-title').innerText = char.title;
        document.getElementById('current-level').innerText = char.level;
        document.getElementById('gold-amount').innerText = char.gold;

        // Cumulative XP progress
        const currentLevelXpStart = getXPForLevel(char.level);
        const nextLevelXpStart = getXPForLevel(char.level + 1);
        const levelTotalNeeded = nextLevelXpStart - currentLevelXpStart;
        const currentLevelProgress = char.xp - currentLevelXpStart;
        const progressPercent = Math.min(100, Math.max(0, (currentLevelProgress / levelTotalNeeded) * 100));

        document.getElementById('current-xp').innerText = currentLevelProgress;
        document.getElementById('next-level-xp').innerText = levelTotalNeeded;
        document.getElementById('xp-progress-bar').style.width = `${progressPercent}%`;

        // Render Stats values and micro progress bars
        for (const statKey in char.stats) {
            const statValue = char.stats[statKey];
            const statXp = char.statsXp[statKey];
            
            // Reaching 100 stat XP gains 1 stat level. So progress percent is statXp
            document.getElementById(`stat-${statKey}`).innerText = statValue;
            document.getElementById(`bar-${statKey}`).style.width = `${statXp}%`;
        }

        // Render unspent points
        const spCounter = document.getElementById('skill-points');
        if (spCounter) {
            spCounter.innerText = char.unspentSP;
        }
    },

    // 2. Render Avatar display in sidebar
    renderAvatar(state) {
        const wrapper = document.getElementById('profile-avatar');
        if (wrapper) {
            const avatar = PRESET_AVATARS.find(a => a.id === state.character.avatarIndex) || PRESET_AVATARS[0];
            wrapper.innerHTML = avatar.svg;
        }
    },

    // 3. Render Dailies Guild Board list
    renderDailies(state, onToggle, onDelete) {
        const listContainer = document.getElementById('daily-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        
        if (state.dailies.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 2rem 0;">
                    <i data-lucide="inbox" style="width: 32px; height: 32px; margin-bottom: 0.5rem; stroke: var(--text-muted);"></i>
                    <p>No daily guild missions. Add one to begin!</p>
                </div>`;
            refreshIcons();
            return;
        }

        state.dailies.forEach(daily => {
            const item = document.createElement('div');
            item.className = `daily-item ${daily.completed ? 'completed' : ''}`;
            item.setAttribute('data-id', daily.id);

            let streakHtml = '';
            if (daily.streak && daily.streak > 0) {
                streakHtml = `<span class="streak-badge" title="Daily streak: ${daily.streak} consecutive days"><i data-lucide="flame"></i> ${daily.streak}</span>`;
            }

            item.innerHTML = `
                <div class="daily-left">
                    <div class="checkbox-custom">
                        <i data-lucide="check"></i>
                    </div>
                    <span class="daily-label">${daily.text}</span>
                    ${streakHtml}
                </div>
                <div class="daily-meta">
                    <span class="tag ${daily.stat}">${daily.stat.substring(0,3)}</span>
                    <span class="reward-badge xp" title="XP">+${daily.xp} XP</span>
                    <span class="reward-badge gold" title="Gold">+${daily.gold}g</span>
                    <button class="btn-delete" title="Remove Daily Mission"><i data-lucide="trash-2"></i></button>
                </div>
            `;

            // Attach event listeners
            item.querySelector('.daily-left').addEventListener('click', () => onToggle(daily.id));
            item.querySelector('.btn-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                onDelete(daily.id);
            });

            listContainer.appendChild(item);
        });

        refreshIcons();
    },

    // 4. Render Active Adventures (Quests)
    renderQuests(state, onSubquestToggle, onClaim, onDelete) {
        const listContainer = document.getElementById('quest-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        const activeQuests = state.quests;

        if (activeQuests.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">
                    <i data-lucide="scroll" style="width: 42px; height: 42px; margin-bottom: 0.5rem; stroke: var(--text-muted);"></i>
                    <p>No active adventures. Formulate a main quest to begin!</p>
                </div>`;
            refreshIcons();
            return;
        }

        activeQuests.forEach(quest => {
            const card = document.createElement('div');
            card.className = `quest-card ${quest.completed ? 'completed-quest' : ''}`;
            card.setAttribute('data-cat', quest.category);

            // Calculate progress
            const subCount = quest.subquests.length;
            const completedCount = quest.subquests.filter(s => s.completed).length;
            const progressPercent = subCount > 0 ? (completedCount / subCount) * 100 : 0;
            const allSubDone = subCount > 0 && completedCount === subCount;

            let cardOpacity = quest.completed ? 'opacity: 0.55;' : '';

            let actionButton = '';
            if (quest.completed) {
                actionButton = `<span class="badge badge-success"><i data-lucide="check-circle-2"></i> Adventured Completed</span>`;
            } else if (allSubDone) {
                actionButton = `<button class="btn btn-primary claim-reward-btn">Claim Rewards!</button>`;
            } else {
                actionButton = `<span class="badge" style="color: var(--text-muted); font-size:0.8rem;">Quest Active</span>`;
            }

            card.style = cardOpacity;

            let subquestsHtml = '';
            quest.subquests.forEach((sub, idx) => {
                subquestsHtml += `
                    <div class="objective-item ${sub.completed ? 'completed' : ''}" data-idx="${idx}">
                        <div class="obj-checkbox">
                            <i data-lucide="check"></i>
                        </div>
                        <span class="objective-text">${sub.text}</span>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="quest-header-row">
                    <div class="quest-title-block">
                        <span class="tag ${quest.category}" style="margin-bottom: 0.5rem; display: inline-block;">
                            ${quest.category} Adventure
                        </span>
                        <h4>${quest.title}</h4>
                    </div>
                    <div class="quest-header-meta">
                        <button class="btn-delete delete-quest-btn" title="Abandon Quest"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>

                <div class="quest-prog-row">
                    <span>Objectives: ${completedCount}/${subCount}</span>
                    <span>${Math.round(progressPercent)}%</span>
                </div>
                <div class="quest-bar-container">
                    <div class="quest-progress" style="width: ${progressPercent}%"></div>
                </div>

                <div class="quest-objectives">
                    ${subquestsHtml}
                </div>

                <div class="quest-footer">
                    <div class="quest-rewards">
                        <span class="reward-badge xp">+${quest.xpReward} XP</span>
                        <span class="reward-badge gold">+${quest.goldReward}g</span>
                    </div>
                    <div class="quest-action">
                        ${actionButton}
                    </div>
                </div>
            `;

            // Bind checkbox clicking
            card.querySelectorAll('.objective-item').forEach(el => {
                el.addEventListener('click', () => {
                    const idx = parseInt(el.getAttribute('data-idx'));
                    onSubquestToggle(quest.id, idx);
                });
            });

            // Bind claim rewards button
            const claimBtn = card.querySelector('.claim-reward-btn');
            if (claimBtn) {
                claimBtn.addEventListener('click', () => onClaim(quest.id));
            }

            // Bind delete button
            card.querySelector('.delete-quest-btn').addEventListener('click', () => onDelete(quest.id));

            listContainer.appendChild(card);
        });

        refreshIcons();
    },

    // 5. Render Achievements Page
    renderAchievements(state) {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        grid.innerHTML = '';

        state.achievements.forEach(ach => {
            const card = document.createElement('div');
            card.className = `badge-card ${ach.unlocked ? 'unlocked' : 'locked'}`;
            
            const progressPercent = ach.target > 0 ? (ach.progress / ach.target) * 100 : 0;
            const progressDisplay = `${ach.progress} / ${ach.target}`;

            card.innerHTML = `
                <div class="badge-icon-wrapper">
                    <i data-lucide="${ach.unlocked ? 'trophy' : 'lock'}"></i>
                </div>
                <div class="badge-title">${ach.title}</div>
                <div class="badge-desc">${ach.desc}</div>
                
                <!-- Tiny Progress tracker -->
                <div style="width: 100%; margin-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                        <span>Progress</span>
                        <span>${progressDisplay}</span>
                    </div>
                    <div style="height: 4px; background: rgba(0,0,0,0.4); border-radius: 2px; overflow:hidden;">
                        <div style="height: 100%; background: ${ach.unlocked ? 'var(--accent-gold)' : 'var(--text-muted)'}; width: ${progressPercent}%;"></div>
                    </div>
                </div>
                
                ${ach.unlocked ? `<div style="font-size: 0.65rem; font-family: var(--font-mono); color: var(--color-health); margin-top: 0.5rem; font-weight: bold;"><i data-lucide="check-circle-2" style="width: 10px; height: 10px; display: inline; vertical-align: middle; margin-right: 2px;"></i> UNLOCKED ${ach.dateUnlocked || ''}</div>` : ''}
            `;

            grid.appendChild(card);
        });

        refreshIcons();
    },

    // 6. Render Skill Tree
    renderSkillTree(state, activeTreeKey, onUnlockNode) {
        const viewport = document.getElementById('skill-tree-viewport');
        if (!viewport) return;

        viewport.innerHTML = '';

        const treeNodes = SKILL_TREES_DATA[activeTreeKey];
        if (!treeNodes) return;

        // Render container elements
        const wrapper = document.createElement('div');
        wrapper.className = 'tree-wrapper';
        wrapper.setAttribute('data-tree', activeTreeKey);

        // Render absolute connections SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'tree-connections-svg');
        wrapper.appendChild(svg);

        // Group nodes by hierarchy level (levels: parent=null is Level 1, etc.)
        // We will layout nodes in vertical levels dynamically
        const levels = [];
        let currentParent = null;

        // Trace nodes step-by-step since it is a chain tree
        let chainNode = treeNodes.find(n => n.parent === null);
        while (chainNode) {
            levels.push([chainNode]);
            const nextNode = treeNodes.find(n => n.parent === chainNode.id);
            chainNode = nextNode;
        }

        // Render nodes rows
        levels.forEach(levelNodes => {
            const levelEl = document.createElement('div');
            levelEl.className = 'tree-level';

            levelNodes.forEach(node => {
                const nodeEl = document.createElement('div');
                nodeEl.className = 'skill-node';
                nodeEl.id = `node-${node.id}`;

                // Check node status
                const isUnlocked = state.unlockedSkills[node.id] || false;
                let isLocked = false;
                let isAvailable = false;

                // Validate parents
                const hasParent = node.parent !== null;
                const parentUnlocked = hasParent ? (state.unlockedSkills[node.parent] || false) : true;
                const reqStatMet = state.character.stats[node.reqStat] >= node.reqVal;

                if (isUnlocked) {
                    nodeEl.classList.add('unlocked');
                } else if (parentUnlocked && reqStatMet && state.character.unspentSP > 0) {
                    nodeEl.classList.add('available');
                    isAvailable = true;
                } else {
                    nodeEl.classList.add('locked');
                    isLocked = true;
                }

                // Render content
                // Choose icon based on category
                let nodeIcon = node.icon || 'shield';

                nodeEl.innerHTML = `
                    <i data-lucide="${nodeIcon}"></i>
                    
                    <!-- Tooltip -->
                    <div class="node-tooltip">
                        <div class="tooltip-title">${node.label}</div>
                        <div class="tooltip-desc">${node.desc}</div>
                        <div class="tooltip-requirement ${reqStatMet ? 'met' : 'unmet'}">
                            Req: ${node.reqStat.toUpperCase()} ${node.reqVal} (${state.character.stats[node.reqStat]}/${node.reqVal})
                        </div>
                        ${hasParent && !parentUnlocked ? `<div class="tooltip-requirement unmet" style="font-size:0.65rem; margin-top:2px;">Requires previous node</div>` : ''}
                        
                        ${isUnlocked ? 
                            `<div style="color: var(--color-health); font-size:0.7rem; font-weight:bold; margin-top: 5px;">[Learned]</div>` : 
                            (isAvailable ? `<div style="color: var(--accent-primary); font-size:0.7rem; font-weight:bold; margin-top: 5px; animation: sparkle-glow 1s infinite alternate;">[Click to Learn (1 SP)]</div>` : 
                            (state.character.unspentSP === 0 && !isLocked ? `<div style="color: var(--text-muted); font-size:0.7rem; margin-top: 5px;">Requires 1 SP</div>` : `<div style="color: var(--text-muted); font-size:0.7rem; margin-top: 5px;">Locked</div>`))
                        }
                    </div>
                `;

                // Handle click learning
                if (isAvailable) {
                    nodeEl.addEventListener('click', () => onUnlockNode(node.id, activeTreeKey));
                }

                levelEl.appendChild(nodeEl);
            });

            wrapper.appendChild(levelEl);
        });

        viewport.appendChild(wrapper);
        refreshIcons();

        // Draw connections after layout finishes rendering
        setTimeout(() => {
            const rectWrapper = wrapper.getBoundingClientRect();
            
            // Loop through levels to connect parents to children
            for (let i = 0; i < levels.length - 1; i++) {
                const parentNode = levels[i][0];
                const childNode = levels[i+1][0];

                const parentEl = document.getElementById(`node-${parentNode.id}`);
                const childEl = document.getElementById(`node-${childNode.id}`);

                if (parentEl && childEl) {
                    const rP = parentEl.getBoundingClientRect();
                    const rC = childEl.getBoundingClientRect();

                    // Calculate centers relative to wrappers coordinates
                    const x1 = (rP.left + rP.right) / 2 - rectWrapper.left;
                    const y1 = (rP.top + rP.bottom) / 2 - rectWrapper.top;

                    const x2 = (rC.left + rC.right) / 2 - rectWrapper.left;
                    const y2 = (rC.top + rC.bottom) / 2 - rectWrapper.top;

                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);

                    const connectionUnlocked = state.unlockedSkills[childNode.id] || false;
                    if (connectionUnlocked) {
                        line.setAttribute('class', 'unlocked-connection');
                        // Use active tree highlight colors
                        let colorHex = 'var(--accent-primary)';
                        if (activeTreeKey === 'strength') colorHex = 'var(--color-strength)';
                        else if (activeTreeKey === 'wealth') colorHex = 'var(--color-wealth)';
                        else if (activeTreeKey === 'health') colorHex = 'var(--color-health)';
                        else if (activeTreeKey === 'social') colorHex = 'var(--color-social)';
                        line.style.stroke = colorHex;
                    }

                    svg.appendChild(line);
                }
            }
        }, 100);
    },

    // 7. Render Reward Shop catalog & Inventory Vault
    renderShop(state, onBuy, onUse, onDeleteItem) {
        const shopGrid = document.getElementById('shop-grid');
        const inventoryGrid = document.getElementById('inventory-grid');
        if (!shopGrid || !inventoryGrid) return;

        // Render Shop Catalog
        shopGrid.innerHTML = '';
        state.shopItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'shop-card';

            const canAfford = state.character.gold >= item.cost;
            let iconCode = item.icon || 'gift';

            card.innerHTML = `
                <div class="shop-item-icon">
                    <i data-lucide="${iconCode}"></i>
                </div>
                <div class="shop-item-title">${item.title}</div>
                <div class="shop-item-desc">${item.desc}</div>
                
                <div class="shop-card-footer">
                    <span class="price-tag"><i data-lucide="coins"></i> ${item.cost}g</span>
                    <button class="btn btn-primary btn-buy" ${canAfford ? '' : 'disabled'}>Buy</button>
                </div>
                ${item.custom ? `<button class="btn-delete delete-shop-item" style="position: absolute; top: 10px; right: 10px;" title="Remove Reward Item"><i data-lucide="x"></i></button>` : ''}
            `;

            // Attach listeners
            card.querySelector('.btn-buy').addEventListener('click', () => onBuy(item.id));
            
            const delBtn = card.querySelector('.delete-shop-item');
            if (delBtn) {
                delBtn.addEventListener('click', () => onDeleteItem(item.id));
            }

            shopGrid.appendChild(card);
        });

        // Render Inventory Vault
        inventoryGrid.innerHTML = '';
        const inventoryKeys = Object.keys(state.inventory);
        
        if (inventoryKeys.length === 0) {
            inventoryGrid.innerHTML = `
                <div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 2rem 0; grid-column: span 3;">
                    <i data-lucide="archive" style="width: 28px; height: 28px; margin-bottom: 0.5rem; stroke: var(--text-muted);"></i>
                    <p style="font-size:0.8rem;">Inventory is empty. Go shopping!</p>
                </div>`;
            refreshIcons();
            return;
        }

        inventoryKeys.forEach(itemId => {
            const qty = state.inventory[itemId];
            const item = state.shopItems.find(s => s.id === itemId);
            if (!item || qty <= 0) return;

            const invCell = document.createElement('div');
            invCell.className = 'inv-card';
            
            let iconCode = item.icon || 'gift';

            invCell.innerHTML = `
                <div class="inv-qty">${qty}</div>
                <div class="inv-icon">
                    <i data-lucide="${iconCode}"></i>
                </div>
                <div class="inv-title" title="${item.title}">${item.title}</div>
                <button class="btn btn-secondary btn-use">Redeem</button>
            `;

            invCell.querySelector('.btn-use').addEventListener('click', () => onUse(itemId));

            inventoryGrid.appendChild(invCell);
        });

        refreshIcons();
    },

    // 8. Render settings pane (Avatar lists, toggle states)
    renderSettings(state, onSelectAvatar) {
        // Sound settings indicators
        const toggle = document.getElementById('sound-toggle');
        if (toggle) toggle.checked = state.settings.soundEffects;

        const vol = document.getElementById('volume-slider');
        if (vol) vol.value = state.settings.sfxVolume;

        // Render filtered avatars grid
        this.renderAvatarGrid(state, onSelectAvatar);
    },

    // Helper to render filtered avatar list inside Settings panel
    renderAvatarGrid(state, onSelectAvatar) {
        const grid = document.getElementById('avatar-selection-grid');
        if (!grid) return;

        grid.innerHTML = '';

        // Read active filters from DOM buttons
        let activeGender = 'all';
        let activeAge = 'all';

        const activeGenderBtn = document.querySelector('.gender-filters .filter-btn.active');
        if (activeGenderBtn) {
            activeGender = activeGenderBtn.getAttribute('data-gender');
        }

        const activeAgeBtn = document.querySelector('.age-filters .filter-btn.active');
        if (activeAgeBtn) {
            activeAge = activeAgeBtn.getAttribute('data-age');
        }

        // Filter PRESET_AVATARS
        const filteredAvatars = PRESET_AVATARS.filter(av => {
            const matchGender = (activeGender === 'all' || av.gender === activeGender);
            const matchAge = (activeAge === 'all' || av.age === activeAge);
            return matchGender && matchAge;
        });

        if (filteredAvatars.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem 0; font-size: 0.85rem;">
                    No avatars match selected filters.
                </div>
            `;
            return;
        }

        filteredAvatars.forEach(av => {
            const cell = document.createElement('div');
            cell.className = `avatar-cell ${state.character.avatarIndex === av.id ? 'selected' : ''}`;
            cell.title = av.name;
            cell.innerHTML = av.svg;
            
            cell.addEventListener('click', () => onSelectAvatar(av.id));
            grid.appendChild(cell);
        });
    },

    // 9. Render Notepad Saved Notes
    renderNotes(state, onEdit, onDelete, searchQuery = '') {
        const grid = document.getElementById('notes-grid');
        if (!grid) return;

        grid.innerHTML = '';

        // Filter notes by search query if present
        let filteredNotes = state.notes || [];
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            filteredNotes = filteredNotes.filter(note => 
                (note.title && note.title.toLowerCase().includes(query)) ||
                (note.content && note.content.toLowerCase().includes(query))
            );
        }

        if (filteredNotes.length === 0) {
            if (searchQuery.trim() !== '') {
                grid.innerHTML = `
                    <div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 3rem 0; grid-column: 1 / -1;">
                        <i data-lucide="search" style="width: 42px; height: 42px; margin-bottom: 0.5rem; stroke: var(--text-muted);"></i>
                        <p>No notes match search query: "${escapeHTML(searchQuery)}"</p>
                    </div>`;
            } else {
                grid.innerHTML = `
                    <div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 3rem 0; grid-column: 1 / -1;">
                        <i data-lucide="sticky-note" style="width: 42px; height: 42px; margin-bottom: 0.5rem; stroke: var(--text-muted);"></i>
                        <p>No notes or reminders saved. Write a note to remember goals or thoughts!</p>
                    </div>`;
            }
            refreshIcons();
            return;
        }

        filteredNotes.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-card ${note.color || 'yellow'}`;
            card.setAttribute('data-id', note.id);
            card.style.cursor = 'pointer'; // Make whole card clickable

            // Render alarm badge if a reminder exists
            let reminderHtml = '';
            if (note.reminder) {
                const isFired = !note.reminderActive;
                const formattedDate = new Date(note.reminder).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                reminderHtml = `
                    <div class="note-reminder-badge ${isFired ? 'fired' : 'active'}" title="${isFired ? 'Alarm triggered' : 'Alarm set'}">
                        <i data-lucide="${isFired ? 'alarm-clock-off' : 'bell'}"></i>
                        <span>Alarm: ${formattedDate}</span>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="note-header">
                    <h4>${escapeHTML(note.title)}</h4>
                    <div class="note-card-actions">
                        <button class="btn-edit-note" title="Edit Note"><i data-lucide="edit-2"></i></button>
                        <button class="btn-delete-note" title="Delete Note"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
                <div class="note-body">${escapeHTML(note.content)}</div>
                ${reminderHtml}
                <div class="note-date">${note.date}</div>
            `;

            // Bind click on delete button specifically
            card.querySelector('.btn-delete-note').addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering card click edit
                onDelete(note.id);
            });

            // Bind click on the entire card to trigger edit (except when clicking delete)
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-delete-note')) return;
                onEdit(note);
            });

            grid.appendChild(card);
        });

        refreshIcons();
    }
};

window.GameUI = GameUI;
