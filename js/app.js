/* ----------------------------------------------------
   Marketing Soul - Main Orchestrator & Event Controller
   ---------------------------------------------------- */

// Web Audio API Retro 8-bit Sound Effects Synthesizer
const SoundSynth = {
    audioCtx: null,

    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    play(type, state) {
        if (!state.settings.soundEffects) return;
        this.init();

        // Safe Volume cap (0.15 scale)
        const volume = (state.settings.sfxVolume || 50) / 100 * 0.15;
        if (volume <= 0) return;

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        switch (type) {
            case 'click':
                // Quick sharp blip
                osc.type = 'sine';
                osc.frequency.setValueAtTime(350, now);
                osc.frequency.exponentialRampToValueAtTime(700, now + 0.05);
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'complete':
                // Retro chime (chord progression)
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
                osc.frequency.setValueAtTime(1046.50, now + 0.21); // C6
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
                break;

            case 'levelup':
                // Epic chiptune fanfare chord synth
                const osc2 = this.audioCtx.createOscillator();
                const gainNode2 = this.audioCtx.createGain();
                osc2.connect(gainNode2);
                gainNode2.connect(this.audioCtx.destination);

                osc.type = 'square';
                osc2.type = 'triangle';

                const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const t = now + idx * 0.09;
                    osc.frequency.setValueAtTime(freq, t);
                    osc2.frequency.setValueAtTime(freq / 2, t);
                });

                gainNode.gain.setValueAtTime(volume * 0.8, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.8);
                gainNode2.gain.setValueAtTime(volume * 0.5, now);
                gainNode2.gain.linearRampToValueAtTime(0.01, now + 0.8);

                osc.start(now);
                osc.stop(now + 0.8);
                osc2.start(now);
                osc2.stop(now + 0.8);
                break;

            case 'buy':
                // Coin registry sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(987.77, now); // B5
                osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.22);
                osc.start(now);
                osc.stop(now + 0.22);
                break;

            case 'unlock':
                // Energy wave sound
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(1100, now + 0.3);
                gainNode.gain.setValueAtTime(volume * 0.6, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'use':
                // Magical heal spell sound
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.28);
                osc.start(now);
                osc.stop(now + 0.28);
                break;
        }
    }
};

// Global App Orchestrator
document.addEventListener('DOMContentLoaded', () => {
    const Engine = window.GameEngine;
    const UI = window.GameUI;

    // Active screen navigation tracking
    let activeTreeKey = 'strength';

    // Temp Level-up modal allocation tracking
    let allocPointsRemaining = 0;
    const allocPointsAllocation = { strength: 0, intelligence: 0, wealth: 0, health: 0, social: 0 };

    // Alarm sound repeating loop reference
    let alarmSoundIntervalId = null;

    // QR Code scanner reference
    let html5QrScanner = null;

    // Consolidated handler for character avatar changes
    function handleSelectAvatar(avatarIdx) {
        SoundSynth.play('click', Engine.state);
        Engine.state.character.avatarIndex = avatarIdx;
        Engine.saveState();
        UI.renderAvatar(Engine.state);
        UI.renderAvatarGrid(Engine.state, handleSelectAvatar);
    }

    function openAvatarFilePicker() {
        const avatarFileInput = document.getElementById('avatar-file-input');
        if (avatarFileInput) {
            avatarFileInput.click();
        }
    }

    function focusAvatarSettings(openPicker = false) {
        renderActiveTab('settings');
        setTimeout(() => {
            const avatarCard = document.querySelector('.select-avatar-card');
            if (avatarCard) {
                avatarCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                avatarCard.classList.add('highlight-focus');
                setTimeout(() => avatarCard.classList.remove('highlight-focus'), 2000);
            }
            if (openPicker) {
                openAvatarFilePicker();
            }
        }, 300);
    }

    /* ------------------------------------
       Initialize System & Initial Rendering
       ------------------------------------ */
    function init() {
        // Initial renders
        UI.renderStats(Engine.state);
        UI.renderAvatar(Engine.state);
        renderActiveTab('quests');
        
        // Settings elements sync
        UI.renderSettings(Engine.state, handleSelectAvatar);

        bindGeneralEvents();
        bindDailiesEvents();
        bindQuestsEvents();
        bindShopEvents();
        bindSettingsEvents();
        bindLevelUpEvents();
        bindNotesEvents();

        // Check for incoming PWA sync parameters in the URL
        checkForSyncPayload();

        // Start Alarm checking loop (every 1 second)
        setInterval(checkAlarms, 1000);

        // Bind alarm dismissal
        const dismissBtn = document.getElementById('dismiss-alarm-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                document.getElementById('alarm-modal').classList.remove('active');
                if (alarmSoundIntervalId) {
                    clearInterval(alarmSoundIntervalId);
                    alarmSoundIntervalId = null;
                }
            });
        }
    }

    /* ------------------------------------
       View Routing & Rendering
       ------------------------------------ */
    function renderActiveTab(tabName) {
        // Clear search input on tab change to reset filter state
        const searchInput = document.getElementById('note-search');
        if (searchInput) {
            searchInput.value = '';
        }

        // Toggle tab panes visibility
        document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

        const targetPane = document.getElementById(`${tabName}-tab`);
        const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
        
        if (targetPane && targetBtn) {
            targetPane.classList.add('active');
            targetBtn.classList.add('active');
        }

        // Target rendering updates
        switch(tabName) {
            case 'quests':
                UI.renderDailies(Engine.state, handleToggleDaily, handleDeleteDaily);
                UI.renderQuests(Engine.state, handleToggleSubquest, handleClaimQuestReward, handleDeleteQuest);
                break;
            case 'skills':
                UI.renderSkillTree(Engine.state, activeTreeKey, handleUnlockSkillNode);
                break;
            case 'achievements':
                UI.renderAchievements(Engine.state);
                break;
            case 'shop':
                UI.renderShop(Engine.state, handlePurchaseShopItem, handleUseInventoryItem, handleDeleteShopItem);
                break;
            case 'notes':
                UI.renderNotes(Engine.state, handleEditNote, handleDeleteNote);
                break;
            case 'settings':
                UI.renderSettings(Engine.state, handleSelectAvatar);
                break;
        }
    }

    /* ------------------------------------
       Core Sound / Level-Up Hooks
       ------------------------------------ */
    function handleActionRewardResult(result) {
        if (result.leveledUp) {
            SoundSynth.play('levelup', Engine.state);
            triggerLevelUpModal(result.newLevel);
        } else {
            SoundSynth.play('complete', Engine.state);
        }
        
        UI.renderStats(Engine.state);
        // Refresh active screen state
        const currentActiveBtn = document.querySelector('.nav-btn.active');
        if (currentActiveBtn) {
            renderActiveTab(currentActiveBtn.getAttribute('data-tab'));
        }
    }

    /* ------------------------------------
       Level-Up Modal Handlers
       ------------------------------------ */
    function triggerLevelUpModal(newLevel) {
        const modal = document.getElementById('levelup-modal');
        if (!modal) return;

        // Reset tracking vars
        // Re-read from GameState, supporting queued level-ups
        allocPointsRemaining = Engine.state.character.allocatedStatPoints;
        
        // Reset allocated counters
        for (const s in allocPointsAllocation) {
            allocPointsAllocation[s] = 0;
        }

        document.getElementById('modal-level').innerText = newLevel;
        document.getElementById('allocated-points-rem').innerText = allocPointsRemaining;

        // Render current stats values in modal rows
        for (const s in Engine.state.character.stats) {
            document.getElementById(`alloc-val-${s}`).innerText = Engine.state.character.stats[s];
        }

        // Enable confirm button ONLY if points remaining is 0
        const confirmBtn = document.getElementById('confirm-level-up');
        confirmBtn.disabled = allocPointsRemaining > 0;

        // Display modal
        modal.classList.add('active');
        updateLevelUpButtonsState();
    }

    function updateLevelUpButtonsState() {
        document.getElementById('allocated-points-rem').innerText = allocPointsRemaining;
        
        for (const s in Engine.state.character.stats) {
            const valSpan = document.getElementById(`alloc-val-${s}`);
            const baseValue = Engine.state.character.stats[s];
            const allocatedAmount = allocPointsAllocation[s];
            
            // Set value label showing base + allocated
            valSpan.innerText = `${baseValue} (+${allocatedAmount})`;

            // Toggle minus button disabled
            const minusBtn = document.querySelector(`.btn-minus[data-stat="${s}"]`);
            if (minusBtn) minusBtn.disabled = allocatedAmount <= 0;

            // Toggle plus button disabled
            const plusBtn = document.querySelector(`.btn-plus[data-stat="${s}"]`);
            if (plusBtn) plusBtn.disabled = allocPointsRemaining <= 0;
        }

        const confirmBtn = document.getElementById('confirm-level-up');
        confirmBtn.disabled = allocPointsRemaining > 0;
    }

    function bindLevelUpEvents() {
        // Minus adjustments
        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                const stat = btn.getAttribute('data-stat');
                if (allocPointsAllocation[stat] > 0) {
                    allocPointsAllocation[stat]--;
                    allocPointsRemaining++;
                    updateLevelUpButtonsState();
                }
            });
        });

        // Plus adjustments
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                const stat = btn.getAttribute('data-stat');
                if (allocPointsRemaining > 0) {
                    allocPointsAllocation[stat]++;
                    allocPointsRemaining--;
                    updateLevelUpButtonsState();
                }
            });
        });

        // Confirm button
        document.getElementById('confirm-level-up').addEventListener('click', () => {
            SoundSynth.play('unlock', Engine.state);
            const success = Engine.allocateStatPoints(allocPointsAllocation);
            if (success) {
                document.getElementById('levelup-modal').classList.remove('active');
                UI.renderStats(Engine.state);
                // Re-render Skill trees since user might have satisfied requirements
                if (document.querySelector('.nav-btn.active').getAttribute('data-tab') === 'skills') {
                    UI.renderSkillTree(Engine.state, activeTreeKey, handleUnlockSkillNode);
                }
            }
        });
    }

    /* ------------------------------------
       Dailies Interactions
       ------------------------------------ */
    function handleToggleDaily(id) {
        const result = Engine.toggleDaily(id);
        if (result) {
            handleActionRewardResult(result);
        }
    }

    function handleDeleteDaily(id) {
        SoundSynth.play('click', Engine.state);
        if (confirm('Delete this daily guild mission?')) {
            Engine.deleteDaily(id);
            UI.renderDailies(Engine.state, handleToggleDaily, handleDeleteDaily);
        }
    }

    function bindDailiesEvents() {
        const form = document.getElementById('add-daily-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                SoundSynth.play('click', Engine.state);

                const text = document.getElementById('daily-input').value.trim();
                const stat = document.getElementById('daily-stat').value;

                if (text) {
                    Engine.addDaily(text, stat);
                    document.getElementById('daily-input').value = '';
                    UI.renderDailies(Engine.state, handleToggleDaily, handleDeleteDaily);
                }
            });
        }
    }

    /* ------------------------------------
       Adventure Quests Interactions
       ------------------------------------ */
    function handleToggleSubquest(questId, idx) {
        const quest = Engine.toggleSubquest(questId, idx);
        if (quest) {
            // Completed subquest gives small rewards
            const isSubDoneNow = quest.subquests[idx].completed;
            SoundSynth.play(isSubDoneNow ? 'complete' : 'click', Engine.state);
            
            // Check for level ups from subquest rewards
            UI.renderStats(Engine.state);
            UI.renderQuests(Engine.state, handleToggleSubquest, handleClaimQuestReward, handleDeleteQuest);
        }
    }

    function handleClaimQuestReward(questId) {
        const result = Engine.claimQuestReward(questId);
        if (result) {
            handleActionRewardResult(result);
        }
    }

    function handleDeleteQuest(questId) {
        SoundSynth.play('click', Engine.state);
        if (confirm('Abandon this active adventure? All subquest completions will be lost.')) {
            Engine.deleteQuest(questId);
            UI.renderQuests(Engine.state, handleToggleSubquest, handleClaimQuestReward, handleDeleteQuest);
        }
    }

    function bindQuestsEvents() {
        const openBtn = document.getElementById('open-quest-modal');
        const closeBtn = document.getElementById('close-quest-modal');
        const modal = document.getElementById('quest-modal');
        const form = document.getElementById('quest-form');
        const addSubBtn = document.getElementById('add-subquest-input-btn');
        const subContainer = document.getElementById('subquest-inputs');

        if (openBtn && closeBtn && modal) {
            openBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                modal.classList.add('active');
            });
            
            closeBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                modal.classList.remove('active');
            });
        }

        // Subquests input expander
        if (addSubBtn && subContainer) {
            addSubBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                const currentInputs = subContainer.querySelectorAll('.subquest-input-row');
                
                if (currentInputs.length >= 5) {
                    alert('Maximum of 5 objectives allowed per quest.');
                    return;
                }

                const newRow = document.createElement('div');
                newRow.className = 'subquest-input-row';
                newRow.innerHTML = `
                    <input type="text" class="subquest-input" placeholder="Subquest #${currentInputs.length + 1}" required>
                    <button type="button" class="btn-delete remove-sub-input" style="padding: 0.5rem;"><i data-lucide="x"></i></button>
                `;

                // Handle subquest input removal
                newRow.querySelector('.remove-sub-input').addEventListener('click', () => {
                    SoundSynth.play('click', Engine.state);
                    newRow.remove();
                    // Rename placeholders
                    const remaining = subContainer.querySelectorAll('.subquest-input-row');
                    remaining.forEach((row, i) => {
                        row.querySelector('input').placeholder = `Subquest #${i + 1}`;
                    });
                    refreshIcons();
                });

                subContainer.appendChild(newRow);
                refreshIcons();
            });
        }

        // Quest creation submission
        if (form && modal) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                SoundSynth.play('unlock', Engine.state);

                const title = document.getElementById('quest-title').value.trim();
                const category = document.getElementById('quest-category').value;
                const xp = parseInt(document.getElementById('quest-xp').value);
                const gold = parseInt(document.getElementById('quest-gold').value);

                // Collect subquests
                const subquests = [];
                subContainer.querySelectorAll('.subquest-input').forEach(input => {
                    const text = input.value.trim();
                    if (text) subquests.push(text);
                });

                if (title && subquests.length > 0) {
                    Engine.addQuest(title, category, subquests, xp, gold);
                    modal.classList.remove('active');
                    
                    // Reset form
                    form.reset();
                    subContainer.innerHTML = `
                        <div class="subquest-input-row">
                            <input type="text" class="subquest-input" placeholder="Subquest #1 (e.g. Hit gym 4x weekly)" required>
                        </div>
                    `;
                    UI.renderQuests(Engine.state, handleToggleSubquest, handleClaimQuestReward, handleDeleteQuest);
                }
            });
        }
    }

    /* ------------------------------------
       Skill Trees Interactions
       ------------------------------------ */
    function handleUnlockSkillNode(nodeId, treeKey) {
        const unlocked = Engine.unlockSkillNode(nodeId, treeKey);
        if (unlocked) {
            SoundSynth.play('unlock', Engine.state);
            UI.renderStats(Engine.state); // Update unspent points
            UI.renderSkillTree(Engine.state, activeTreeKey, handleUnlockSkillNode);
        }
    }

    /* ------------------------------------
       Shop Catalog & Inventory Interactions
       ------------------------------------ */
    function handlePurchaseShopItem(itemId) {
        const bought = Engine.purchaseRewardItem(itemId);
        if (bought) {
            SoundSynth.play('buy', Engine.state);
            UI.renderStats(Engine.state); // Deducts gold
            UI.renderShop(Engine.state, handlePurchaseShopItem, handleUseInventoryItem, handleDeleteShopItem);
        }
    }

    function handleUseInventoryItem(itemId) {
        const used = Engine.useInventoryItem(itemId);
        if (used) {
            SoundSynth.play('use', Engine.state);
            UI.renderShop(Engine.state, handlePurchaseShopItem, handleUseInventoryItem, handleDeleteShopItem);
        }
    }

    function handleDeleteShopItem(itemId) {
        SoundSynth.play('click', Engine.state);
        if (confirm('Remove this custom item from the shop?')) {
            Engine.deleteShopItem(itemId);
            UI.renderShop(Engine.state, handlePurchaseShopItem, handleUseInventoryItem, handleDeleteShopItem);
        }
    }

    function bindShopEvents() {
        const openBtn = document.getElementById('open-shop-modal');
        const closeBtn = document.getElementById('close-shop-modal');
        const modal = document.getElementById('shop-modal');
        const form = document.getElementById('shop-form');

        if (openBtn && closeBtn && modal) {
            openBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                modal.classList.add('active');
            });
            closeBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                modal.classList.remove('active');
            });
        }

        if (form && modal) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                SoundSynth.play('unlock', Engine.state);

                const title = document.getElementById('reward-title').value.trim();
                const desc = document.getElementById('reward-desc').value.trim();
                const cost = parseInt(document.getElementById('reward-cost').value);
                const icon = document.getElementById('reward-icon').value;

                if (title && cost > 0) {
                    Engine.addShopReward(title, desc, cost, icon);
                    modal.classList.remove('active');
                    form.reset();
                    UI.renderShop(Engine.state, handlePurchaseShopItem, handleUseInventoryItem, handleDeleteShopItem);
                }
            });
        }
    }

    /* ------------------------------------
       General Nav Bindings & Name Edits
       ------------------------------------ */
    function bindGeneralEvents() {
        // Tab selectors
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                const tab = btn.getAttribute('data-tab');
                renderActiveTab(tab);
            });
        });

        // Skill tree category selectors
        document.querySelectorAll('.tree-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                document.querySelectorAll('.tree-select-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                activeTreeKey = btn.getAttribute('data-tree');
                UI.renderSkillTree(Engine.state, activeTreeKey, handleUnlockSkillNode);
            });
        });

        // Click on Avatar in Sidebar opens Settings Tab
        const avatarBtn = document.getElementById('avatar-btn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                focusAvatarSettings();
            });
        }

        // Inline character renaming
        const nameInput = document.getElementById('char-name');
        if (nameInput) {
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    nameInput.blur();
                }
            });

            nameInput.addEventListener('blur', () => {
                const name = nameInput.innerText.trim();
                if (name) {
                    Engine.state.character.name = name;
                    Engine.saveState();
                } else {
                    nameInput.innerText = Engine.state.character.name;
                }
            });
        }

        // Click on Avatar pencil badge always goes to settings avatar selector now
        const avatarUploadBtn = document.getElementById('avatar-upload-btn');
        const avatarFileInput = document.getElementById('avatar-file-input');
        if (avatarUploadBtn) {
            avatarUploadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                SoundSynth.play('click', Engine.state);
                focusAvatarSettings(true);
            });
        }

        if (avatarFileInput) {
            avatarFileInput.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                // Limit file size to 1.5MB to avoid huge localStorage blobs
                const maxBytes = 1.5 * 1024 * 1024;
                if (file.size > maxBytes) {
                    alert('Please choose an image smaller than 1.5MB.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (ev) => {
                    const dataUrl = ev.target.result;
                    Engine.state.character.avatarImage = dataUrl;
                    Engine.saveState();
                    UI.renderAvatar(Engine.state);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    /* ------------------------------------
       Settings Pane Handlers (Volume/Backup)
       ------------------------------------ */
    function bindSettingsEvents() {
        const soundToggle = document.getElementById('sound-toggle');
        const volSlider = document.getElementById('volume-slider');
        const exportBtn = document.getElementById('export-data-btn');
        const importBtnTrigger = document.getElementById('import-data-btn-trigger');
        const importInput = document.getElementById('import-file-input');
        const avatarUploadSettingsBtn = document.getElementById('avatar-upload-settings-btn');
        const avatarFileInput = document.getElementById('avatar-file-input');
        const resetBtn = document.getElementById('reset-data-btn');

        // Avatar selection filters click handlers
        document.querySelectorAll('.avatar-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                
                // Toggle active filter class
                const group = btn.closest('.filter-group');
                group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Trigger filtered re-render of avatar grid selection
                UI.renderAvatarGrid(Engine.state, handleSelectAvatar);
            });
        });

        if (avatarUploadSettingsBtn && avatarFileInput) {
            avatarUploadSettingsBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                avatarFileInput.click();
            });
        }

        if (soundToggle) {
            soundToggle.addEventListener('change', () => {
                Engine.state.settings.soundEffects = soundToggle.checked;
                Engine.saveState();
                SoundSynth.play('click', Engine.state);
            });
        }

        if (volSlider) {
            volSlider.addEventListener('input', () => {
                Engine.state.settings.sfxVolume = parseInt(volSlider.value);
                Engine.saveState();
            });

            volSlider.addEventListener('change', () => {
                // Play check volume beep when user releases slider
                SoundSynth.play('click', Engine.state);
            });
        }

        // JSON Backup Export
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Engine.state, null, 2));
                const dlAnchorElem = document.createElement('a');
                dlAnchorElem.setAttribute("href", dataStr);
                dlAnchorElem.setAttribute("download", `marketing_soul_backup_${new Date().toISOString().slice(0,10)}.json`);
                dlAnchorElem.click();
            });
        }

        // JSON Backup Import
        if (importBtnTrigger && importInput) {
            importBtnTrigger.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                importInput.click();
            });

            importInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const success = Engine.importStateJSON(event.target.result);
                    if (success) {
                        alert('Backup loaded successfully! Re-syncing character sheet...');
                        window.location.reload();
                    } else {
                        alert('Invalid backup file. Load failed.');
                    }
                };
                reader.readAsText(file);
            });
        }

        // Game Reset / Wipe Save File
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                if (confirm('WARNING: This will permanently wipe your RPG character, gold, inventory, achievements, and quest logs. Are you sure you want to delete all progress?')) {
                    Engine.resetState();
                    alert('Progress wiped. Restarting adventure!');
                    window.location.reload();
                }
            });
        }

        // QR Code Mobile Sync
        const syncMobileBtn = document.getElementById('sync-mobile-btn');
        const syncModal = document.getElementById('sync-modal');
        const closeSyncModal = document.getElementById('close-sync-modal');

        if (syncMobileBtn) {
            syncMobileBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                
                const currentUrl = window.location.origin + window.location.pathname;
                
                // Convert state to Base64
                const stateStr = JSON.stringify(Engine.state);
                const b64State = btoa(unescape(encodeURIComponent(stateStr)));
                const syncUrl = `${currentUrl}?sync=${b64State}`;
                
                syncModal.classList.add('active');
                
                if (window.QRious) {
                    new window.QRious({
                        element: document.getElementById('sync-qr-canvas'),
                        value: syncUrl,
                        size: 240,
                        background: 'white',
                        foreground: '#0d0c16',
                        level: 'L'
                    });
                } else {
                    console.error('QRious library not loaded');
                }
            });
        }

        if (closeSyncModal && syncModal) {
            closeSyncModal.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                syncModal.classList.remove('active');
            });
        }

        // QR Code Webcam Scanner (Desktop Sync from Mobile)
        const scanQrBtn = document.getElementById('scan-qr-btn');
        const scannerModal = document.getElementById('scanner-modal');
        const closeScannerModal = document.getElementById('close-scanner-modal');

        if (scanQrBtn) {
            scanQrBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                scannerModal.classList.add('active');
                startQrScanner();
            });
        }

        if (closeScannerModal && scannerModal) {
            closeScannerModal.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                stopQrScanner();
                scannerModal.classList.remove('active');
            });
        }
    }

    /* ------------------------------------
       Notepad Interactions & Events
       ------------------------------------ */
    function handleEditNote(note) {
        SoundSynth.play('click', Engine.state);
        
        document.getElementById('note-id-input').value = note.id;
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-reminder').value = note.reminder || '';
        
        const colorRadio = document.querySelector(`.note-color-selectors input[value="${note.color || 'yellow'}"]`);
        if (colorRadio) colorRadio.checked = true;

        document.getElementById('editor-title-text').innerHTML = '<i data-lucide="edit-3"></i> Edit Note';
        document.getElementById('cancel-edit-btn').style.display = 'inline-flex';
        document.getElementById('save-note-btn').innerText = 'Update Note';
        
        document.querySelector('.note-editor').scrollIntoView({ behavior: 'smooth' });
        
        // Focus the title input and place cursor at the end
        const titleInput = document.getElementById('note-title');
        titleInput.focus();
        const val = titleInput.value;
        titleInput.value = '';
        titleInput.value = val;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function handleDeleteNote(id) {
        SoundSynth.play('click', Engine.state);
        if (confirm('Are you sure you want to delete this note?')) {
            Engine.deleteNote(id);
            SoundSynth.play('complete', Engine.state);
            UI.renderNotes(Engine.state, handleEditNote, handleDeleteNote);
            
            if (document.getElementById('note-id-input').value === id) {
                resetNoteForm();
            }
        }
    }

    function resetNoteForm() {
        document.getElementById('note-id-input').value = '';
        document.getElementById('note-form').reset();
        document.getElementById('editor-title-text').innerHTML = '<i data-lucide="edit-3"></i> Add Quick Note';
        document.getElementById('cancel-edit-btn').style.display = 'none';
        document.getElementById('save-note-btn').innerText = 'Save Note';
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function bindNotesEvents() {
        const form = document.getElementById('note-form');
        const cancelBtn = document.getElementById('cancel-edit-btn');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const id = document.getElementById('note-id-input').value;
                const title = document.getElementById('note-title').value.trim();
                const content = document.getElementById('note-content').value.trim();
                const reminder = document.getElementById('note-reminder').value;
                
                const colorEl = document.querySelector('input[name="note-color"]:checked');
                const color = colorEl ? colorEl.value : 'yellow';

                if (title && content) {
                    if (id) {
                        Engine.editNote(id, title, content, color, reminder);
                        SoundSynth.play('unlock', Engine.state);
                    } else {
                        Engine.addNote(title, content, color, reminder);
                        SoundSynth.play('unlock', Engine.state);
                    }
                    
                    resetNoteForm();
                    UI.renderNotes(Engine.state, handleEditNote, handleDeleteNote);
                }
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                SoundSynth.play('click', Engine.state);
                resetNoteForm();
            });
        }

        // Bind live search text input filtering
        const searchInput = document.getElementById('note-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                UI.renderNotes(Engine.state, handleEditNote, handleDeleteNote, query);
            });
        }
    }

    function checkAlarms() {
        if (!Engine.state.notes || Engine.state.notes.length === 0) return;
        
        const now = new Date();
        let stateChanged = false;
        
        Engine.state.notes.forEach(note => {
            if (note.reminder && note.reminderActive) {
                const alarmTime = new Date(note.reminder);
                if (now >= alarmTime) {
                    note.reminderActive = false;
                    stateChanged = true;
                    
                    document.getElementById('alarm-note-title').innerText = note.title;
                    document.getElementById('alarm-note-content').innerText = note.content;
                    document.getElementById('alarm-modal').classList.add('active');
                    
                    SoundSynth.play('complete', Engine.state);
                    if (!alarmSoundIntervalId) {
                        alarmSoundIntervalId = setInterval(() => {
                            SoundSynth.play('complete', Engine.state);
                        }, 1500);
                    }
                }
            }
        });
        
        if (stateChanged) {
            Engine.saveState();
            const activeTabBtn = document.querySelector('.nav-btn.active');
            if (activeTabBtn && activeTabBtn.getAttribute('data-tab') === 'notes') {
                UI.renderNotes(Engine.state, handleEditNote, handleDeleteNote);
            }
        }
    }

    // Window resize listener to redraw skill tree connecting lines
    window.addEventListener('resize', () => {
        const activeTabBtn = document.querySelector('.nav-btn.active');
        if (activeTabBtn && activeTabBtn.getAttribute('data-tab') === 'skills') {
            UI.renderSkillTree(Engine.state, activeTreeKey, handleUnlockSkillNode);
        }
    });

    /* ------------------------------------
       PWA Sync Payload Detection (Mobile/Cross-Device)
       ------------------------------------ */
    function checkForSyncPayload() {
        const urlParams = new URLSearchParams(window.location.search);
        const syncPayload = urlParams.get('sync');
        
        if (syncPayload) {
            const confirmModal = document.getElementById('sync-confirm-modal');
            const acceptBtn = document.getElementById('btn-sync-accept');
            const declineBtn = document.getElementById('btn-sync-decline');
            
            if (confirmModal) {
                // Display the confirmation overlay
                confirmModal.classList.add('active');
                
                if (acceptBtn) {
                    acceptBtn.onclick = () => {
                        try {
                            const jsonStr = decodeURIComponent(escape(atob(syncPayload)));
                            const success = Engine.importStateJSON(jsonStr);
                            if (success) {
                                SoundSynth.play('levelup', Engine.state);
                                alert('Success! Progress synced and loaded.');
                            } else {
                                alert('Sync failed. Invalid data structure.');
                            }
                        } catch (e) {
                            console.error('Sync decoding error', e);
                            alert('Sync failed. Decryption failed.');
                        }
                        // Redirect to remove sync parameters from URL
                        window.location.href = window.location.origin + window.location.pathname;
                    };
                }
                
                if (declineBtn) {
                    declineBtn.onclick = () => {
                        SoundSynth.play('click', Engine.state);
                        confirmModal.classList.remove('active');
                        // Clean URL query arguments without reload
                        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
                    };
                }
            }
        }
    }

    /* ------------------------------------
       Notepad Interactions & Events
       ------------------------------------ */
    function startQrScanner() {
        if (!window.Html5Qrcode) {
            console.error("Html5Qrcode library not loaded yet.");
            alert("Scanner library loading, please try again in a moment.");
            document.getElementById('scanner-modal').classList.remove('active');
            return;
        }

        html5QrScanner = new window.Html5Qrcode("qr-reader");
        html5QrScanner.start(
            { facingMode: "user" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                SoundSynth.play('click', Engine.state);
                stopQrScanner();
                document.getElementById('scanner-modal').classList.remove('active');
                handleScannedUrl(decodedText);
            },
            (errorMessage) => {
                // parse error, silent
            }
        ).catch(err => {
            console.error("Camera start failed", err);
            alert("Could not access webcam. Please verify camera permissions in your browser.");
            document.getElementById('scanner-modal').classList.remove('active');
        });
    }

    function stopQrScanner() {
        if (html5QrScanner) {
            html5QrScanner.stop().then(() => {
                html5QrScanner = null;
            }).catch(err => {
                console.error("Camera stop failed", err);
            });
        }
    }

    function handleScannedUrl(urlText) {
        try {
            const url = new URL(urlText);
            const syncPayload = url.searchParams.get('sync');
            
            if (syncPayload) {
                const confirmModal = document.getElementById('sync-confirm-modal');
                const acceptBtn = document.getElementById('btn-sync-accept');
                const declineBtn = document.getElementById('btn-sync-decline');
                
                if (confirmModal) {
                    confirmModal.classList.add('active');
                    
                    acceptBtn.onclick = () => {
                        try {
                            const jsonStr = decodeURIComponent(escape(atob(syncPayload)));
                            const success = Engine.importStateJSON(jsonStr);
                            if (success) {
                                SoundSynth.play('levelup', Engine.state);
                                alert('Success! Progress synced and loaded.');
                                window.location.reload();
                            } else {
                                alert('Sync failed. Invalid data structure.');
                            }
                        } catch (e) {
                            console.error('Decoding failed', e);
                            alert('Sync failed. Invalid data encoding.');
                        }
                    };
                    
                    declineBtn.onclick = () => {
                        SoundSynth.play('click', Engine.state);
                        confirmModal.classList.remove('active');
                    };
                }
            } else {
                alert('Scanned QR code does not contain Marketing Soul Sync data.');
            }
        } catch (e) {
            alert('Invalid QR code format. Please scan a Marketing Soul Sync QR code.');
        }
    }

    // Launch Application
    init();
});
