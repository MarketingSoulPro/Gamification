/* ----------------------------------------------------
   Marketing Soul - Game State & Database Engine
   ---------------------------------------------------- */

// Define default assets database
const DEFAULT_DAILIES = [
    { id: 'd1', text: 'Drink 2L water', stat: 'health', completed: false, xp: 10, gold: 5, streak: 0 },
    { id: 'd2', text: 'Workout or stretch for 20 mins', stat: 'strength', completed: false, xp: 20, gold: 10, streak: 0 },
    { id: 'd3', text: 'Read a book for 30 mins', stat: 'intelligence', completed: false, xp: 15, gold: 8, streak: 0 },
    { id: 'd4', text: 'Review daily spending / Budgeting', stat: 'wealth', completed: false, xp: 10, gold: 5, streak: 0 },
    { id: 'd5', text: 'Reach out to a friend or networking lead', stat: 'social', completed: false, xp: 15, gold: 8, streak: 0 }
];

const DEFAULT_QUESTS = [
    {
        id: 'q1',
        title: 'The Warrior\'s Transformation',
        category: 'strength',
        completed: false,
        xpReward: 350,
        goldReward: 150,
        subquests: [
            { text: 'Walk 8,000 steps daily for 5 days', completed: false },
            { text: 'Gym workout 4 times in a week', completed: false },
            { text: 'Meet daily protein target', completed: false }
        ]
    },
    {
        id: 'q2',
        title: 'Wizard\'s Academy Initiation',
        category: 'intelligence',
        completed: false,
        xpReward: 300,
        goldReward: 120,
        subquests: [
            { text: 'Finish reading 1 non-fiction book', completed: false },
            { text: 'Complete 3 hours of an online course', completed: false },
            { text: 'Write down key learnings from course', completed: false }
        ]
    }
];

const DEFAULT_SHOP_ITEMS = [
    { id: 's1', title: 'Favorite Coffee Treat', desc: 'Treat yourself to a premium specialty coffee.', cost: 80, icon: 'coffee', custom: false },
    { id: 's2', title: 'Epic Cheat Meal', desc: 'Order pizza, burgers, or sushi from your favorite spot.', cost: 200, icon: 'pizza', custom: false },
    { id: 's3', title: 'Gaming Session (1 hr)', desc: '1 hour of guilt-free video games.', cost: 100, icon: 'gamepad', custom: false },
    { id: 's4', title: 'Cinema Movie Night', desc: 'Go out to see a movie in theaters or stream a new release.', cost: 250, icon: 'tv', custom: false },
    { id: 's5', title: 'Steam/Epic Game Purchase', desc: 'Buy a game you\'ve wanted from your wishlist.', cost: 600, icon: 'shopping-bag', custom: false },
    { id: 's6', title: 'Weekend Gateway Trip', desc: 'Spend a weekend relaxing in a nearby city or resort.', cost: 1500, icon: 'plane', custom: false }
];

const SKILL_TREES_DATA = {
    strength: [
        { id: 'str_1', label: 'Novice Walker', desc: 'Unlock consistent walking habit (10 mins daily).', reqStat: 'strength', reqVal: 2, parent: null, unlocked: false, icon: 'footprints' },
        { id: 'str_2', label: 'Daily Hiker', desc: 'Double walking distance (30 mins daily).', reqStat: 'strength', reqVal: 5, parent: 'str_1', unlocked: false, icon: 'compass' },
        { id: 'str_3', label: 'Endurance Runner', desc: 'Train cardiovascular health. Complete a 5K run.', reqStat: 'strength', reqVal: 8, parent: 'str_2', unlocked: false, icon: 'zap' },
        { id: 'str_4', label: 'Iron Athlete', desc: 'Establish weightlifting or intense sport routine.', reqStat: 'strength', reqVal: 12, parent: 'str_3', unlocked: false, icon: 'dumbbell' }
    ],
    intelligence: [
        { id: 'int_1', label: 'Curious Learner', desc: 'Listen to an educational podcast or read articles daily.', reqStat: 'intelligence', reqVal: 2, parent: null, unlocked: false, icon: 'lightbulb' },
        { id: 'int_2', label: 'Avid Bookworm', desc: 'Read 10 pages of a book daily.', reqStat: 'intelligence', reqVal: 5, parent: 'int_1', unlocked: false, icon: 'book-open' },
        { id: 'int_3', label: 'Skill Specialist', desc: 'Build expert skills. Complete a certified course.', reqStat: 'intelligence', reqVal: 8, parent: 'int_2', unlocked: false, icon: 'graduation-cap' },
        { id: 'int_4', label: 'Philosopher Sage', desc: 'Write blogs or teach others a complex subject.', reqStat: 'intelligence', reqVal: 12, parent: 'int_3', unlocked: false, icon: 'award' }
    ],
    wealth: [
        { id: 'wlt_1', label: 'Penny Saver', desc: 'Save first $100 and establish a savings habit.', reqStat: 'wealth', reqVal: 2, parent: null, unlocked: false, icon: 'piggy-bank' },
        { id: 'wlt_2', label: 'Budget Commander', desc: 'Track all monthly expenses for 30 consecutive days.', reqStat: 'wealth', reqVal: 5, parent: 'wlt_1', unlocked: false, icon: 'pie-chart' },
        { id: 'wlt_3', label: 'Passive Investor', desc: 'Invest money in index funds or retirement savings.', reqStat: 'wealth', reqVal: 8, parent: 'wlt_2', unlocked: false, icon: 'trending-up' },
        { id: 'wlt_4', label: 'Financial Shield', desc: 'Reach emergency fund goal of 3-6 months expenses.', reqStat: 'wealth', reqVal: 12, parent: 'wlt_3', unlocked: false, icon: 'shield' }
    ],
    health: [
        { id: 'hlt_1', label: 'Hydro Acolyte', desc: 'Meet your daily water hydration goals for 7 days.', reqStat: 'health', reqVal: 2, parent: null, unlocked: false, icon: 'droplet' },
        { id: 'hlt_2', label: 'Snooze Master', desc: 'Get 7-8 hours of quality sleep for 7 days straight.', reqStat: 'health', reqVal: 5, parent: 'hlt_1', unlocked: false, icon: 'moon' },
        { id: 'hlt_3', label: 'Clean Eater', desc: 'Track nutrients. Eliminate processed sugars for a week.', reqStat: 'health', reqVal: 8, parent: 'hlt_2', unlocked: false, icon: 'apple' },
        { id: 'hlt_4', label: 'Zen Practitioner', desc: 'Incorporate daily 10-minute mindfulness / meditation.', reqStat: 'health', reqVal: 12, parent: 'hlt_3', unlocked: false, icon: 'wind' }
    ],
    social: [
        { id: 'soc_1', label: 'Polite Ally', desc: 'Send a positive, check-in text to a family member.', reqStat: 'social', reqVal: 2, parent: null, unlocked: false, icon: 'message-circle' },
        { id: 'soc_2', label: 'Circle Weaver', desc: 'Organize a social hangout or dinner with friends.', reqStat: 'social', reqVal: 5, parent: 'soc_1', unlocked: false, icon: 'users' },
        { id: 'soc_3', label: 'Guild Recruiter', desc: 'Attend a professional networking event or meet new people.', reqStat: 'social', reqVal: 8, parent: 'soc_2', unlocked: false, icon: 'briefcase' },
        { id: 'soc_4', label: 'Pillar of Support', desc: 'Provide mentorship or volunteer/help your local community.', reqStat: 'social', reqVal: 12, parent: 'soc_3', unlocked: false, icon: 'heart' }
    ]
};

const ACHIEVEMENTS_DATA = [
    { id: 'ach_1', title: 'Early Bird', desc: 'Complete 10 daily tasks aligned with Health or strength.', unlocked: false, progress: 0, target: 10 },
    { id: 'ach_2', title: 'Iron Scholar', desc: 'Level up your Intelligence stat to Level 5.', unlocked: false, progress: 1, target: 5 },
    { id: 'ach_3', title: 'Treasure Hoarder', desc: 'Accumulate 1,000 total Gold coins in your purse.', unlocked: false, progress: 150, target: 1000 },
    { id: 'ach_4', title: 'Questing Knight', desc: 'Complete 3 Active Adventures.', unlocked: false, progress: 0, target: 3 },
    { id: 'ach_5', title: 'Master of Disciplines', desc: 'Unlock at least 5 nodes in any Skill Trees.', unlocked: false, progress: 0, target: 5 },
    { id: 'ach_6', title: 'Indomitable Streak', desc: 'Complete all daily tasks in one day.', unlocked: false, progress: 0, target: 1 }
];

const PRESET_AVATARS = [
    // --- MEN (YOUNG) ---
    {
        id: 0, gender: 'man', age: 'young', name: 'Apprentice Squire',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#1b4332" />
            <circle cx="50" cy="46" r="22" fill="#ffd8be" />
            <!-- Squire Hair -->
            <path d="M25 36 C32 18, 68 18, 75 36 L78 48 C78 48, 72 40, 68 42 C64 44, 60 52, 50 48 C40 52, 36 44, 32 42 C28 40, 22 48, 22 48 Z" fill="#6c584c" />
            <!-- Wood collar -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#b7b7a4" />
            <path d="M42 66 L50 78 L58 66 Z" fill="#ddb892" />
        </svg>`
    },
    {
        id: 1, gender: 'man', age: 'young', name: 'Wizard Initiate',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#03045e" />
            <circle cx="50" cy="48" r="20" fill="#ffe5d9" />
            <!-- Novice Hat -->
            <path d="M30 42 L50 15 L70 42 Z" fill="#48cae4" />
            <circle cx="50" cy="22" r="3.5" fill="#ffbe0b" />
            <path d="M20 40 C35 40, 65 40, 80 40 L80 44 C65 44, 35 44, 20 44 Z" fill="#9d4edd" />
            <!-- Robe -->
            <path d="M15 90 C15 70, 85 70, 85 90 Z" fill="#3a0ca3" />
        </svg>`
    },
    {
        id: 2, gender: 'man', age: 'young', name: 'Cheeky Rogue',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#212529" />
            <circle cx="50" cy="46" r="21" fill="#fddcbb" />
            <!-- Bandana Cover -->
            <path d="M26 40 C35 22, 65 22, 74 40 Z" fill="#c30010" />
            <path d="M30 50 L70 50 L66 60 L34 60 Z" fill="#c30010" />
            <!-- Messy rogue hair strands -->
            <path d="M24 38 L30 44 L28 34" stroke="#111" stroke-width="2" stroke-linecap="round" />
            <path d="M76 38 L70 44 L72 34" stroke="#111" stroke-width="2" stroke-linecap="round" />
            <!-- Cloak -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#343a40" />
        </svg>`
    },

    // --- MEN (ADULT) ---
    {
        id: 3, gender: 'man', age: 'adult', name: 'Iron Paladin',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#2d004d" />
            <circle cx="50" cy="45" r="22" fill="#ffb703" />
            <!-- Helmet -->
            <path d="M30 32 C30 14, 70 14, 70 32 L70 50 C70 50, 50 55, 30 50 Z" fill="#9d4edd" />
            <rect x="36" y="30" width="28" height="8" rx="2" fill="#00f2fe" />
            <rect x="48" y="22" width="4" height="8" fill="#ff357a" />
            <!-- Armor -->
            <path d="M15 85 C15 65, 85 65, 85 85 Z" fill="#7b2cbf" />
            <path d="M40 68 L50 82 L60 68 Z" fill="#00f2fe" />
        </svg>`
    },
    {
        id: 4, gender: 'man', age: 'adult', name: 'Mystic Spellblade',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#0d1b2a" />
            <circle cx="50" cy="46" r="22" fill="#fddcbb" />
            <!-- Beard -->
            <path d="M28 48 C28 66, 72 66, 72 48 L64 64 C64 64, 50 72, 36 64 Z" fill="#415a77" />
            <!-- Mage Hood -->
            <path d="M26 38 C26 16, 74 16, 74 38 C74 54, 26 54, 26 38 Z" fill="#1b263b" />
            <!-- Glowing Eyes -->
            <circle cx="42" cy="38" r="2.5" fill="#00f2fe" />
            <circle cx="58" cy="38" r="2.5" fill="#00f2fe" />
            <!-- Robe -->
            <path d="M15 90 C15 70, 85 70, 85 90 Z" fill="#415a77" />
        </svg>`
    },
    {
        id: 5, gender: 'man', age: 'adult', name: 'Shadow Assassin',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#080808" />
            <circle cx="50" cy="46" r="21" fill="#f8ad9d" />
            <!-- Ninja cowl -->
            <path d="M25 40 C25 18, 75 18, 75 40 C75 58, 25 58, 25 40 Z" fill="#212529" />
            <path d="M30 46 L70 46 L65 58 L35 58 Z" fill="#151719" />
            <!-- Red Visor Eyes -->
            <path d="M38 38 L45 38" stroke="#ff477e" stroke-width="3.5" stroke-linecap="round" />
            <path d="M55 38 L62 38" stroke="#ff477e" stroke-width="3.5" stroke-linecap="round" />
            <!-- Dark shoulders -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#151719" />
        </svg>`
    },

    // --- MEN (ELDER) ---
    {
        id: 6, gender: 'man', age: 'elder', name: 'Veteran Commander',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#4a4e69" />
            <circle cx="50" cy="46" r="22" fill="#ffd8be" />
            <!-- Hair & Scar -->
            <path d="M26 38 C35 15, 65 15, 74 38 Z" fill="#e9ecef" />
            <path d="M38 40 L44 52" stroke="#d90429" stroke-width="2.5" />
            <!-- Crown -->
            <path d="M26 28 L40 32 L50 20 L60 32 L74 28 L70 36 L30 36 Z" fill="#ffbe0b" />
            <!-- Fur armor -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#22223b" />
            <circle cx="50" cy="74" r="8" fill="#adb5bd" />
        </svg>`
    },
    {
        id: 7, gender: 'man', age: 'elder', name: 'Archmage Sage',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#3c096c" />
            <circle cx="50" cy="45" r="20" fill="#ffe5d9" />
            <!-- White beard -->
            <path d="M30 48 C30 76, 70 76, 70 48 L64 68 C64 68, 50 78, 36 68 Z" fill="#f8f9fa" />
            <!-- Sage Wizard Hat -->
            <path d="M28 40 L50 8 L72 40 Z" fill="#7b2cbf" />
            <rect x="22" y="38" width="56" height="4" rx="2" fill="#e0aaff" />
            <!-- Spectacles -->
            <circle cx="43" cy="42" r="5" fill="none" stroke="#ffbe0b" stroke-width="2" />
            <circle cx="57" cy="42" r="5" fill="none" stroke="#ffbe0b" stroke-width="2" />
            <line x1="48" y1="42" x2="52" y2="42" stroke="#ffbe0b" stroke-width="2" />
            <!-- Cloak -->
            <path d="M15 90 C15 70, 85 70, 85 90 Z" fill="#240046" />
        </svg>`
    },
    {
        id: 8, gender: 'man', age: 'elder', name: 'Grand Treasurer',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#3e2723" />
            <circle cx="50" cy="46" r="22" fill="#ffcad4" />
            <!-- Grey Hair -->
            <path d="M24 38 C28 20, 72 20, 76 38 Z" fill="#adb5bd" />
            <!-- Monocle -->
            <circle cx="56" cy="44" r="6" fill="none" stroke="#ffbe0b" stroke-width="2" />
            <line x1="62" y1="44" x2="72" y2="52" stroke="#ffbe0b" stroke-width="1.5" />
            <!-- Robe -->
            <path d="M15 90 C15 68, 85 68, 85 90 Z" fill="#780000" />
            <rect x="47" y="68" width="6" height="22" fill="#ffbe0b" />
        </svg>`
    },

    // --- WOMEN (YOUNG) ---
    {
        id: 9, gender: 'woman', age: 'young', name: 'Sword Novice',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#2d6a4f" />
            <circle cx="50" cy="46" r="22" fill="#ffd8be" />
            <!-- Ponytail Hair -->
            <path d="M26 38 C32 18, 68 18, 74 38 L68 58 L32 58 Z" fill="#b5828c" />
            <circle cx="50" cy="22" r="5" fill="#d90429" /> <!-- Red ribbon hair tie -->
            <!-- Silver headband -->
            <path d="M30 32 L70 32 L68 35 L32 35 Z" fill="#ced4da" />
            <rect x="48" y="30" width="4" height="6" fill="#00f2fe" />
            <!-- Armor plate -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#495057" />
        </svg>`
    },
    {
        id: 10, gender: 'woman', age: 'young', name: 'Star Sorceress',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#240046" />
            <circle cx="50" cy="48" r="20" fill="#ffe5d9" />
            <!-- Braided dark hair with star crown -->
            <path d="M26 40 C35 22, 65 22, 74 40 Z" fill="#212529" />
            <rect x="30" y="24" width="40" height="4" fill="#c77dff" rx="2" />
            <!-- Glowing Pink star gem -->
            <polygon points="50,14 52,20 58,20 53,24 55,30 50,26 45,30 47,24 42,20 48,20" fill="#ff5e9c" />
            <!-- Robe and magical light badge -->
            <path d="M15 90 C15 70, 85 70, 85 90 Z" fill="#5a189a" />
            <circle cx="50" cy="74" r="5.5" fill="#ff5e9c" />
        </svg>`
    },
    {
        id: 11, gender: 'woman', age: 'young', name: 'Nimble Thief',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#2b2d42" />
            <circle cx="50" cy="46" r="21" fill="#fddcbb" />
            <!-- Double Buns Hair -->
            <path d="M25 40 C32 24, 68 24, 75 40 Z" fill="#4f5d75" />
            <circle cx="28" cy="24" r="9" fill="#4f5d75" />
            <circle cx="72" cy="24" r="9" fill="#4f5d75" />
            <!-- Purple mask -->
            <path d="M30 48 L70 48 L66 58 L34 58 Z" fill="#9d4edd" />
            <!-- Leather outfit -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#1d3557" />
        </svg>`
    },

    // --- WOMEN (ADULT) ---
    {
        id: 12, gender: 'woman', age: 'adult', name: 'Shield Valkyrie',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#0077b6" />
            <circle cx="50" cy="46" r="22" fill="#ffd8be" />
            <!-- Blonde braided hair -->
            <path d="M26 38 C32 18, 68 18, 74 38 Z" fill="#f7b05b" />
            <!-- Braids dangling -->
            <rect x="25" y="38" width="6" height="30" rx="3" fill="#f7b05b" />
            <rect x="69" y="38" width="6" height="30" rx="3" fill="#f7b05b" />
            <!-- Winged Helmet -->
            <path d="M32 30 C32 15, 68 15, 68 30 Z" fill="#94a3b8" />
            <!-- Left Wing -->
            <path d="M34 26 L18 10 L26 30 Z" fill="#e2e8f0" />
            <!-- Right Wing -->
            <path d="M66 26 L82 10 L74 30 Z" fill="#e2e8f0" />
            <!-- Armor -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#475569" />
            <circle cx="50" cy="74" r="7" fill="#ffbe0b" />
        </svg>`
    },
    {
        id: 13, gender: 'woman', age: 'adult', name: 'Light Priestess',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#4a4e69" />
            <circle cx="50" cy="45" r="20" fill="#ffe5d9" />
            <!-- Silver hood & gold halo -->
            <circle cx="50" cy="40" r="30" fill="none" stroke="#ffbe0b" stroke-width="3" />
            <path d="M25 40 C25 16, 75 16, 75 40 C75 56, 25 56, 25 40 Z" fill="#f8f9fa" />
            <!-- Glowing Yellow Eyes -->
            <circle cx="42" cy="38" r="3" fill="#ffbe0b" />
            <circle cx="58" cy="38" r="3" fill="#ffbe0b" />
            <!-- Priestly Robes -->
            <path d="M15 90 C15 70, 85 70, 85 90 Z" fill="#f8f9fa" />
            <path d="M46 66 L50 82 L54 66 Z" fill="#ffbe0b" />
        </svg>`
    },
    {
        id: 14, gender: 'woman', age: 'adult', name: 'Woodland Ranger',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#31572c" />
            <circle cx="50" cy="46" r="22" fill="#ffd8be" />
            <!-- Forest Green Hood -->
            <path d="M25 40 C25 18, 75 18, 75 40 C75 56, 25 56, 25 40 Z" fill="#132a13" />
            <!-- Archer paint lines on cheeks -->
            <line x1="32" y1="46" x2="38" y2="46" stroke="#4f772d" stroke-width="2.5" />
            <line x1="68" y1="46" x2="62" y2="46" stroke="#4f772d" stroke-width="2.5" />
            <!-- Leather tunic -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#3f292b" />
            <line x1="30" y1="78" x2="70" y2="78" stroke="#ffbe0b" stroke-width="3" />
        </svg>`
    },

    // --- WOMEN (ELDER) ---
    {
        id: 15, gender: 'woman', age: 'elder', name: 'Grand Shieldmaiden',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#1d3557" />
            <circle cx="50" cy="46" r="22" fill="#ffd8be" />
            <!-- Grey Hair long braided bun -->
            <path d="M26 38 C32 18, 68 18, 74 38 Z" fill="#dee2e6" />
            <rect x="22" y="38" width="6" height="28" fill="#dee2e6" rx="2" />
            <rect x="72" y="38" width="6" height="28" fill="#dee2e6" rx="2" />
            <!-- Heavy Fur Collar -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#6c757d" />
            <!-- Gold medallion -->
            <circle cx="50" cy="74" r="6" fill="#ffbe0b" />
        </svg>`
    },
    {
        id: 16, gender: 'woman', age: 'elder', name: 'Grand Archdruidess',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#132a13" />
            <circle cx="50" cy="46" r="21" fill="#ffe5d9" />
            <!-- Silver Hair -->
            <path d="M26 38 C35 15, 65 15, 74 38 Z" fill="#e9ecef" />
            <!-- Leaf Crown -->
            <path d="M30 30 C30 30, 40 22, 50 28 C60 22, 70 30, 70 30 Z" fill="#52b788" />
            <!-- Robe and emerald amulet -->
            <path d="M15 90 C15 70, 85 70, 85 90 Z" fill="#4f772d" />
            <polygon points="50,68 55,75 50,82 45,75" fill="#52b788" />
        </svg>`
    },
    {
        id: 17, gender: 'woman', age: 'elder', name: 'Master Shadowstalker',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#10002b" />
            <circle cx="50" cy="46" r="21" fill="#ffd8be" />
            <!-- Grey Hair strands under dark hood -->
            <path d="M25 40 C25 18, 75 18, 75 40 C75 56, 25 56, 25 40 Z" fill="#240046" />
            <!-- Hair bangs -->
            <path d="M32 38 L38 48 L35 34" stroke="#adb5bd" stroke-width="2" />
            <path d="M68 38 L62 48 L65 34" stroke="#adb5bd" stroke-width="2" />
            <!-- Glowing Purple Eyes -->
            <circle cx="42" cy="40" r="2.5" fill="#c77dff" />
            <circle cx="58" cy="40" r="2.5" fill="#c77dff" />
            <!-- Cloak -->
            <path d="M15 88 C15 68, 85 68, 85 88 Z" fill="#3c096c" />
        </svg>`
    }
];

// Helper: Calculate XP levels curve
// Level 1 = 0 XP
// Level 2 = 100 XP
// Level 3 = 250 XP
// Level 4 = 450 XP
// Level L = Level L-1 + 100 + (L-2)*50
// Cumulative XP formulas:
// lvlXp = Cumulative XP required to reach level L
function getXPForLevel(level) {
    if (level <= 1) return 0;
    let total = 0;
    for (let i = 2; i <= level; i++) {
        total += 100 + (i - 2) * 50;
    }
    return total;
}

// Find level given cumulative XP
function getLevelForXP(xp) {
    let level = 1;
    while (true) {
        let req = getXPForLevel(level + 1);
        if (xp >= req) {
            level++;
        } else {
            break;
        }
    }
    return level;
}

class GameStateEngine {
    constructor() {
        this.state = this.loadState();
        this.listeners = [];
        this.checkInitialDateReset();
    }

    loadState() {
        const defaultState = {
            character: {
                name: 'Hero',
                level: 1,
                xp: 0,
                gold: 150,
                title: 'Novice',
                avatarIndex: 0,
                unspentSP: 0, // Skill Points
                allocatedStatPoints: 0, // Unallocated Stat points from Level Up
                stats: {
                    strength: 1,
                    intelligence: 1,
                    wealth: 1,
                    health: 1,
                    social: 1
                },
                // XP within each stat. Reaching 100 increments the stat level
                statsXp: {
                    strength: 0,
                    intelligence: 0,
                    wealth: 0,
                    health: 0,
                    social: 0
                }
            },
            dailies: JSON.parse(JSON.stringify(DEFAULT_DAILIES)),
            quests: JSON.parse(JSON.stringify(DEFAULT_QUESTS)),
            shopItems: JSON.parse(JSON.stringify(DEFAULT_SHOP_ITEMS)),
            inventory: {}, // itemId: count
            unlockedSkills: {}, // skillNodeId: true
            achievements: JSON.parse(JSON.stringify(ACHIEVEMENTS_DATA)),
            notes: [],
            settings: {
                soundEffects: true,
                sfxVolume: 50
            },
            lastResetDate: new Date().toDateString()
        };

        try {
            const saved = localStorage.getItem('questify_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Deep merge defaultState structures to support retrofitting updates
                const merged = this.deepMerge(defaultState, parsed);
                return merged;
            }
        } catch (e) {
            console.error('Failed to load local state', e);
        }
        return defaultState;
    }

    deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    saveState() {
        try {
            localStorage.setItem('questify_state', JSON.stringify(this.state));
        } catch (e) {
            console.error('Failed to save state', e);
        }
        this.notifyListeners();
    }

    resetState() {
        localStorage.removeItem('questify_state');
        this.state = this.loadState();
        this.saveState();
    }

    registerListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        for (const cb of this.listeners) {
            cb(this.state);
        }
    }

    // Check if day changed to reset dailies
    checkInitialDateReset() {
        const currentDate = new Date().toDateString();
        if (this.state.lastResetDate !== currentDate) {
            this.state.dailies.forEach(d => {
                if (!d.completed) {
                    d.streak = 0; // Missed consecutive days, streak resets to 0!
                }
                d.completed = false; // Reset checkbox for new day
            });
            this.state.lastResetDate = currentDate;
            this.saveState();
        }
    }

    /* Core Rewards Action Hooks */
    rewardXPAndGold(xpReward, goldReward, category = null) {
        const prevLevel = this.state.character.level;
        
        // Add cumulative XP
        this.state.character.xp += xpReward;
        this.state.character.gold += goldReward;

        // Check level up
        const newLevel = getLevelForXP(this.state.character.xp);
        let leveledUp = false;
        
        if (newLevel > prevLevel) {
            const levelsGained = newLevel - prevLevel;
            this.state.character.level = newLevel;
            // Award Skill Points (1 per level) and Stat Points (3 per level)
            this.state.character.unspentSP += levelsGained;
            this.state.character.allocatedStatPoints += levelsGained * 3;
            leveledUp = true;
        }

        // Add progress to category stat XP
        if (category && this.state.character.statsXp[category] !== undefined) {
            // Task completed rewards category stat progress matching tasks' base XP
            this.state.character.statsXp[category] += xpReward;
            
            // Standard: Reaching 100 stat XP levels up the stat by 1 point!
            while (this.state.character.statsXp[category] >= 100) {
                this.state.character.statsXp[category] -= 100;
                this.state.character.stats[category]++;
            }
        }

        this.checkAchievements();
        this.saveState();

        return { leveledUp, newLevel };
    }

    spendGold(amount) {
        if (this.state.character.gold >= amount) {
            this.state.character.gold -= amount;
            this.saveState();
            return true;
        }
        return false;
    }

    /* Stats Allocations */
    allocateStatPoints(allocatedMap) {
        let totalAlloc = 0;
        for (const stat in allocatedMap) {
            totalAlloc += allocatedMap[stat];
        }

        if (totalAlloc <= this.state.character.allocatedStatPoints) {
            for (const stat in allocatedMap) {
                this.state.character.stats[stat] += allocatedMap[stat];
            }
            this.state.character.allocatedStatPoints -= totalAlloc;
            this.checkAchievements();
            this.saveState();
            return true;
        }
        return false;
    }

    /* Quests & Dailies CRUD Actions */
    addDaily(text, stat) {
        const id = 'd_' + Date.now();
        this.state.dailies.push({
            id,
            text,
            stat,
            completed: false,
            xp: 15,
            gold: 5,
            streak: 0
        });
        this.saveState();
    }

    toggleDaily(id) {
        const daily = this.state.dailies.find(d => d.id === id);
        if (daily) {
            daily.completed = !daily.completed;
            let result = { leveledUp: false };
            
            if (daily.completed) {
                // Increment streak count on completion
                daily.streak = (daily.streak || 0) + 1;
                // Award XP and Gold
                result = this.rewardXPAndGold(daily.xp, daily.gold, daily.stat);
            } else {
                // Roll back streak count on uncompletion
                daily.streak = Math.max(0, (daily.streak || 0) - 1);
                // Deduct XP and Gold (uncompleting)
                this.state.character.xp = Math.max(0, this.state.character.xp - daily.xp);
                this.state.character.gold = Math.max(0, this.state.character.gold - daily.gold);
                
                // Roll back level
                this.state.character.level = getLevelForXP(this.state.character.xp);
                
                // Deduct Stat XP
                this.state.character.statsXp[daily.stat] = Math.max(0, this.state.character.statsXp[daily.stat] - daily.xp);
                this.saveState();
            }
            
            this.checkAchievements();
            return { daily, ...result };
        }
        return null;
    }

    deleteDaily(id) {
        this.state.dailies = this.state.dailies.filter(d => d.id !== id);
        this.saveState();
    }

    addQuest(title, category, subquestsTextList, xpReward, goldReward) {
        const id = 'q_' + Date.now();
        const subquests = subquestsTextList.map(text => ({ text, completed: false }));
        
        this.state.quests.push({
            id,
            title,
            category,
            completed: false,
            xpReward,
            goldReward,
            subquests
        });
        this.saveState();
    }

    toggleSubquest(questId, subquestIndex) {
        const quest = this.state.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            const sub = quest.subquests[subquestIndex];
            if (sub) {
                sub.completed = !sub.completed;
                
                // Small milestone award for marking off subquests!
                if (sub.completed) {
                    this.rewardXPAndGold(15, 5, quest.category);
                } else {
                    this.state.character.xp = Math.max(0, this.state.character.xp - 15);
                    this.state.character.gold = Math.max(0, this.state.character.gold - 5);
                    this.state.character.statsXp[quest.category] = Math.max(0, this.state.character.statsXp[quest.category] - 15);
                    this.saveState();
                }
                this.checkAchievements();
                return quest;
            }
        }
        return null;
    }

    claimQuestReward(questId) {
        const questIndex = this.state.quests.findIndex(q => q.id === questId);
        if (questIndex > -1) {
            const quest = this.state.quests[questIndex];
            // Check if all subquests are completed
            const allDone = quest.subquests.every(s => s.completed);
            if (allDone && !quest.completed) {
                quest.completed = true;
                const result = this.rewardXPAndGold(quest.xpReward, quest.goldReward, quest.category);
                
                // Remove completed quests from active dashboard panel or archive them?
                // We keep them marked completed, then filter in components rendering
                this.checkAchievements();
                this.saveState();
                return { quest, ...result };
            }
        }
        return null;
    }

    deleteQuest(questId) {
        this.state.quests = this.state.quests.filter(q => q.id !== questId);
        this.saveState();
    }

    /* Skill Trees Unlock Trigger */
    unlockSkillNode(nodeId, treeKey) {
        const tree = SKILL_TREES_DATA[treeKey];
        if (!tree) return false;

        const node = tree.find(n => n.id === nodeId);
        if (!node) return false;

        // Check if already unlocked
        if (this.state.unlockedSkills[nodeId]) return false;

        // Check Skill Points (SP)
        if (this.state.character.unspentSP < 1) return false;

        // Check Stat Value requirements
        const curStatVal = this.state.character.stats[node.reqStat];
        if (curStatVal < node.reqVal) return false;

        // Check parent node unlocked requirements
        if (node.parent && !this.state.unlockedSkills[node.parent]) return false;

        // Deduct SP & Unlock
        this.state.character.unspentSP--;
        this.state.unlockedSkills[nodeId] = true;

        // Apply passive title rewards or attributes if wanted
        this.state.character.title = node.label; // Equip newly learned skill title!

        this.checkAchievements();
        this.saveState();
        return true;
    }

    /* Rewards Shop Items CRUD & Inventory usage */
    addShopReward(title, desc, cost, icon) {
        const id = 's_' + Date.now();
        this.state.shopItems.push({
            id,
            title,
            desc,
            cost,
            icon,
            custom: true
        });
        this.saveState();
    }

    purchaseRewardItem(itemId) {
        const item = this.state.shopItems.find(s => s.id === itemId);
        if (item) {
            const didSpend = this.spendGold(item.cost);
            if (didSpend) {
                if (!this.state.inventory[itemId]) {
                    this.state.inventory[itemId] = 0;
                }
                this.state.inventory[itemId]++;
                this.checkAchievements();
                this.saveState();
                return true;
            }
        }
        return false;
    }

    useInventoryItem(itemId) {
        if (this.state.inventory[itemId] && this.state.inventory[itemId] > 0) {
            this.state.inventory[itemId]--;
            if (this.state.inventory[itemId] === 0) {
                delete this.state.inventory[itemId];
            }
            this.saveState();
            return true;
        }
        return false;
    }

    deleteShopItem(itemId) {
        this.state.shopItems = this.state.shopItems.filter(s => s.id !== itemId);
        this.saveState();
    }

    /* Dynamic Achievements Verification */
    checkAchievements() {
        let saveNeeded = false;
        
        this.state.achievements.forEach(ach => {
            if (ach.unlocked) return;

            let currentProgress = 0;
            switch(ach.id) {
                case 'ach_1': // Early Bird - 10 completed dailies in health/strength
                    // Note: We can check dynamic completed totals or base stats as proxy.
                    // Let's track stat level sum of health + strength or count how many dailies are completed.
                    // We can track historical counts, or simply check if strength + health stats total is high.
                    // Let's check: (STR - 1) + (HLT - 1) * 3 which tracks completed task points.
                    // Let's count them: (strength level - 1) + (health level - 1). Every 5 completes is roughly 1 level.
                    currentProgress = Math.max(0, (this.state.character.stats.strength - 1) + (this.state.character.stats.health - 1));
                    break;
                case 'ach_2': // Iron Scholar - INT Level 5
                    currentProgress = this.state.character.stats.intelligence;
                    break;
                case 'ach_3': // Treasure Hoarder - 1,000 total gold coins
                    currentProgress = this.state.character.gold;
                    break;
                case 'ach_4': // Questing Knight - 3 Completed Adventures
                    currentProgress = this.state.quests.filter(q => q.completed).length;
                    break;
                case 'ach_5': // Master of Disciplines - 5 skills unlocked
                    currentProgress = Object.keys(this.state.unlockedSkills).length;
                    break;
                case 'ach_6': // Indomitable Streak - All default dailies completed in current day
                    // Since it resets, check if active dailies are all completed
                    const completedActiveCount = this.state.dailies.filter(d => d.completed).length;
                    currentProgress = (completedActiveCount === this.state.dailies.length && this.state.dailies.length > 0) ? 1 : 0;
                    break;
            }

            ach.progress = Math.min(ach.target, currentProgress);

            if (ach.progress >= ach.target) {
                ach.unlocked = true;
                ach.dateUnlocked = new Date().toLocaleDateString();
                
                // Bonus Achievement rewards!
                this.state.character.gold += 100; // Gift 100 gold coins
                saveNeeded = true;
            }
        });

        if (saveNeeded) {
            // We do not save recursively, state checker sets flag to write output
        }
    }

    /* Notepad CRUD Actions */
    addNote(title, content, color = 'yellow', reminder = '') {
        const id = 'note_' + Date.now();
        const dateStr = new Date().toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        this.state.notes.push({
            id,
            title,
            content,
            color,
            date: dateStr,
            reminder: reminder || null,
            reminderActive: reminder ? true : false
        });
        this.saveState();
        return id;
    }

    editNote(id, title, content, color, reminder = '') {
        const note = this.state.notes.find(n => n.id === id);
        if (note) {
            note.title = title;
            note.content = content;
            if (color) note.color = color;
            
            // Check if reminder changed to reset activity status
            const newReminder = reminder || null;
            if (note.reminder !== newReminder) {
                note.reminder = newReminder;
                note.reminderActive = newReminder ? true : false;
            }
            
            const dateStr = new Date().toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            note.date = dateStr + ' (Edited)';
            
            this.saveState();
            return true;
        }
        return false;
    }

    deleteNote(id) {
        this.state.notes = this.state.notes.filter(n => n.id !== id);
        this.saveState();
    }

    importStateJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.character && parsed.character.stats) {
                this.state = parsed;
                this.checkInitialDateReset();
                this.saveState();
                return true;
            }
        } catch (e) {
            console.error('Import failed', e);
        }
        return false;
    }
}

// Global Engine Instance
window.GameEngine = new GameStateEngine();
