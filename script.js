// ゲーム状態管理
class GameState {
    constructor() {
        this.currentStage = 1;
        this.completedStages = new Set();
        this.soundVolume = 50;
        this.effectVolume = 50;
        this.loadFromStorage();
    }

    saveToStorage() {
        const data = {
            completedStages: Array.from(this.completedStages),
            soundVolume: this.soundVolume,
            effectVolume: this.effectVolume
        };
        localStorage.setItem('networkGameState', JSON.stringify(data));
    }

    loadFromStorage() {
        const data = localStorage.getItem('networkGameState');
        if (data) {
            const parsed = JSON.parse(data);
            this.completedStages = new Set(parsed.completedStages || []);
            this.soundVolume = parsed.soundVolume || 50;
            this.effectVolume = parsed.effectVolume || 50;
        }
    }

    completeStage(stage) {
        this.completedStages.add(stage);
        this.saveToStorage();
    }

    isStageCompleted(stage) {
        return this.completedStages.has(stage);
    }

    isStageUnlocked(stage) {
        if (stage === 1) return true;
        return this.completedStages.has(stage - 1);
    }
}

// グローバル変数
let gameState = new GameState();
let currentGame = null;

// NetworkGameクラスの宣言
class NetworkGame {
    constructor(stageNumber) {
        // ゲームの初期化コードをここに追加
    }

    destroy() {
        // ゲームの破棄コードをここに追加
    }

    reset() {
        // ゲームのリセットコードをここに追加
    }
}

// 画面遷移
function showScreen(screenId) {
    // 全ての画面を非表示
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // 指定された画面を表示
    document.getElementById(screenId + '-screen').classList.add('active');
    
    // ステージ選択画面の場合、ステージ状態を更新
    if (screenId === 'stage-select') {
        updateStageSelect();
    }
    
    // 設定画面の場合、現在の設定値を反映
    if (screenId === 'settings') {
        updateSettingsUI();
    }
}

// ステージ選択画面の更新
function updateStageSelect() {
    for (let i = 1; i <= 3; i++) {
        const stageCard = document.getElementById(`stage-${i}`);
        const statusElement = document.getElementById(`status-${i}`);
        
        if (gameState.isStageCompleted(i)) {
            statusElement.textContent = '✅ クリア済み';
            statusElement.style.color = '#228B22';
            stageCard.classList.remove('locked');
        } else if (gameState.isStageUnlocked(i)) {
            statusElement.textContent = '▶ プレイ可能';
            statusElement.style.color = '#4682B4';
            stageCard.classList.remove('locked');
        } else {
            statusElement.textContent = '🔒 ロック中';
            statusElement.style.color = '#888';
            stageCard.classList.add('locked');
        }
    }
}

// ステージ開始
function startStage(stageNumber) {
    if (!gameState.isStageUnlocked(stageNumber)) {
        alert('このステージはまだロックされています！');
        return;
    }
    
    gameState.currentStage = stageNumber;
    showScreen('game');
    
    // ゲーム初期化
    if (currentGame) {
        currentGame.destroy();
    }
    currentGame = new NetworkGame(stageNumber);
}

// ステージクリア
function completeStage() {
    gameState.completeStage(gameState.currentStage);
    showStageClear(gameState.currentStage);
}

// ステージクリア画面表示
function showStageClear(stageNumber) {
    document.getElementById('clear-title').textContent = `🎉 ステージ ${stageNumber} クリア！ 🎉`;
    
    // 学習内容設定
    const learningContent = document.getElementById('learning-content');
    learningContent.innerHTML = getLearningContent(stageNumber);
    
    // 次のステージボタンの表示制御
    const nextButton = document.getElementById('next-stage-btn');
    if (stageNumber < 3) {
        nextButton.style.display = 'inline-block';
        nextButton.onclick = () => startStage(stageNumber + 1);
    } else {
        nextButton.style.display = 'none';
    }
    
    showScreen('stage-clear');
}

// 学習内容取得
function getLearningContent(stage) {
    const contents = {
        1: `
            <p><strong>🎯 ネットワーク基礎を学習しました！</strong></p>
            <br>
            <p><strong>✅ IPアドレスの重要性</strong></p>
            <ul>
                <li>パケット（データ）が目的地に到達するには、正しいIPアドレスが必要</li>
                <li>IPアドレスは、インターネット上の住所のようなもの</li>
            </ul>
            <br>
            <p><strong>✅ パケットの概念</strong></p>
            <ul>
                <li>データは小さなパケットに分割されて送信される</li>
                <li>各パケットには送信先の情報が含まれている</li>
            </ul>
            <br>
            <p>次のステージでは、ルーターの役割について学習します！</p>
        `,
        2: `
            <p><strong>🎯 ルーターと経路について学習しました！</strong></p>
            <br>
            <p><strong>✅ ルーターの役割</strong></p>
            <ul>
                <li>ルーターは郵便局のように、パケットを正しい方向に転送する</li>
                <li>複数の経路から最適なルートを選択する</li>
            </ul>
            <br>
            <p><strong>✅ 経路選択</strong></p>
            <ul>
                <li>ネットワークには複数の道筋がある</li>
                <li>効率的な経路を選ぶことで、通信速度が向上する</li>
            </ul>
            <br>
            <p>次のステージでは、サブネットについて学習します！</p>
        `,
        3: `
            <p><strong>🎯 IPアドレスとサブネットについて学習しました！</strong></p>
            <br>
            <p><strong>✅ サブネットの概念</strong></p>
            <ul>
                <li>大きなネットワークを小さな部分に分割する技術</li>
                <li>効率的なネットワーク管理が可能になる</li>
            </ul>
            <br>
            <p><strong>✅ ネットワーク設計</strong></p>
            <ul>
                <li>適切なサブネット分割により、セキュリティと性能が向上</li>
                <li>IPアドレスの無駄遣いを防ぐことができる</li>
            </ul>
            <br>
            <p><strong>おめでとうございます！基本的なネットワーク概念を習得しました！</strong></p>
        `
    };
    return contents[stage] || 'ステージをクリアしました！';
}

// 次のステージ
function nextStage() {
    if (gameState.currentStage < 3) {
        startStage(gameState.currentStage + 1);
    }
}

// ステージリプレイ
function replayStage() {
    startStage(gameState.currentStage);
}

// ステージリセット
function resetStage() {
    if (currentGame) {
        currentGame.reset();
    }
}

// ゲームメニュー表示
function showGameMenu() {
    document.getElementById('game-menu-modal').classList.add('active');
}

// ゲームメニュー閉じる
function closeGameMenu() {
    document.getElementById('game-menu-modal').classList.remove('active');
}

// 設定UI更新
function updateSettingsUI() {
    const bgmSlider = document.getElementById('bgm-volume');
    const effectSlider = document.getElementById('effect-volume');
    const bgmValue = document.getElementById('bgm-value');
    const effectValue = document.getElementById('effect-value');
    
    bgmSlider.value = gameState.soundVolume;
    effectSlider.value = gameState.effectVolume;
    bgmValue.textContent = gameState.soundVolume;
    effectValue.textContent = gameState.effectVolume;
    
    // スライダーイベント
    bgmSlider.oninput = function() {
        bgmValue.textContent = this.value;
    };
    
    effectSlider.oninput = function() {
        effectValue.textContent = this.value;
    };
}

// 設定保存
function saveSettings() {
    gameState.soundVolume = parseInt(document.getElementById('bgm-volume').value);
    gameState.effectVolume = parseInt(document.getElementById('effect-volume').value);
    gameState.saveToStorage();
}

// クレジット表示
function showCredits() {
    alert(`ネットワーク学習ゲーム

開発者: ネットワーク教育チーム
バージョン: アルファ版 v0.1
目的: ネットワークの基礎を楽しく学習

このゲームは教育目的で作成されました。`);
}

// ゲーム終了
function exitGame() {
    if (confirm('ゲームを終了しますか？')) {
        window.close();
    }
}

// モーダル外クリックで閉じる
document.getElementById('game-menu-modal').onclick = function(event) {
    if (event.target === this) {
        closeGameMenu();
    }
};

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    showScreen('menu');
    updateStageSelect();
});