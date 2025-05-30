// ゲーム状態管理
class GameState {
    constructor() {
        this.currentStage = 1;
        this.currentProblem = 1;
        this.completedStages = new Set();
        this.soundVolume = 50;
        this.effectVolume = 50;
        this.selectedLocation = null;
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

    resetProblem() {
        this.selectedLocation = null;
        this.currentProblem = 1;
    }
}

// グローバル変数
let gameState = new GameState();

// 問題データ
const stageProblems = {
    1: [
        {
            title: "大問1：IPアドレス編",
            problemNumber: "問題1-1",
            hint: "あなたは、A子さんに手紙を出したい...郵便局の行き先を指定してね！",
            correctAnswer: "post-office",
            explanation: "正解！郵便局の住所を正しく選択できました。IPアドレスも同じように、正確な宛先を指定することが重要です。"
        },
        {
            title: "大問1：IPアドレス編",
            problemNumber: "問題1-2",
            hint: "今度は病院に薬を届けたい...正しい住所を選んでね！",
            correctAnswer: "hospital",
            explanation: "正解！病院の住所を正しく選択できました。ネットワークでも同様に、正確な宛先指定が必要です。"
        }
    ]
};

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
    gameState.resetProblem();
    showScreen('game');
    initializeGame();
}

// ゲーム初期化
function initializeGame() {
    const stage = gameState.currentStage;
    const problem = gameState.currentProblem;
    const problemData = stageProblems[stage][problem - 1];
    
    if (!problemData) {
        // ステージクリア
        completeStage();
        return;
    }
    
    // UI更新
    document.getElementById('stage-title').textContent = problemData.title;
    document.getElementById('problem-number').textContent = problemData.problemNumber;
    document.getElementById('hint-text').textContent = problemData.hint;
    
    // 進行度更新
    const totalProblems = stageProblems[stage].length;
    const progress = ((problem - 1) / totalProblems) * 100;
    updateProgress(progress);
    
    // 選択状態リセット
    resetSelections();
    
    // 送信ボタン無効化
    document.getElementById('send-button').disabled = true;
}

// ドラッグ開始
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.classList.add('dragging');
    
    // ドロップ先のハイライト
    document.getElementById('packet-kun').classList.add('drop-target');
}

// ドラッグ終了
function dragEnd(event) {
    event.target.classList.remove('dragging');
    document.getElementById('packet-kun').classList.remove('drop-target');
}

// ドロップ許可
function allowDrop(event) {
    event.preventDefault();
}

// ドロップ処理
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    
    // ドラッグ終了スタイル
    draggedElement.classList.remove('dragging');
    document.getElementById('packet-kun').classList.remove('drop-target');
    
    // 住所設定
    const addressText = draggedElement.querySelector('.address').textContent;
    document.getElementById('packet-address').textContent = addressText;
    document.getElementById('selected-address').textContent = addressText;
    
    // 選択状態を保存
    gameState.selectedLocation = data;
    
    // 送信ボタン有効化
    document.getElementById('send-button').disabled = false;
}

// パケット送信
function sendPacket() {
    if (!gameState.selectedLocation) return;
    
    const stage = gameState.currentStage;
    const problem = gameState.currentProblem;
    const problemData = stageProblems[stage][problem - 1];
    
    const isCorrect = gameState.selectedLocation === problemData.correctAnswer;
    
    // アニメーション効果
    const packetCharacter = document.getElementById('packet-kun');
    packetCharacter.classList.add(isCorrect ? 'correct' : 'wrong');
    
    setTimeout(() => {
        packetCharacter.classList.remove('correct', 'wrong');
        showResult(isCorrect, problemData.explanation);
    }, 1000);
}

// 結果表示
function showResult(isCorrect, explanation) {
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    const nextBtn = document.getElementById('result-next-btn');
    
    if (isCorrect) {
        title.textContent = '🎉 正解！';
        title.style.color = '#228B22';
        message.textContent = explanation;
        nextBtn.style.display = 'inline-block';
        
        // 進行度更新
        const stage = gameState.currentStage;
        const totalProblems = stageProblems[stage].length;
        const progress = (gameState.currentProblem / totalProblems) * 100;
        updateProgress(progress);
    } else {
        title.textContent = '❌ 不正解';
        title.style.color = '#DC143C';
        message.textContent = '残念！もう一度考えてみましょう。正しい住所を選択してください。';
        nextBtn.style.display = 'none';
    }
    
    modal.classList.add('active');
}

// 結果モーダルを閉じる
function closeResultModal() {
    document.getElementById('result-modal').classList.remove('active');
}

// 次の問題
function nextProblem() {
    closeResultModal();
    
    const stage = gameState.currentStage;
    const totalProblems = stageProblems[stage].length;
    
    if (gameState.currentProblem < totalProblems) {
        gameState.currentProblem++;
        initializeGame();
    } else {
        // ステージクリア
        completeStage();
    }
}

// 選択状態リセット
function resetSelections() {
    document.getElementById('packet-address').textContent = '住所なし';
    document.getElementById('selected-address').textContent = 'ここに住所をドラッグ';
    gameState.selectedLocation = null;
}

// 進行度更新
function updateProgress(value) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressFill.style.width = value + '%';
    progressText.textContent = `進行度: ${Math.round(value)}%`;
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
            <p><strong>🎯 IPアドレスの基礎を学習しました！</strong></p>
            <br>
            <p><strong>✅ IPアドレスとは</strong></p>
            <ul>
                <li>ネットワーク上の住所のようなもの</li>
                <li>正確な宛先指定により、データが目的地に到達する</li>
                <li>間違った住所では、データは届かない</li>
            </ul>
            <br>
            <p><strong>✅ pingコマンド</strong></p>
            <ul>
                <li>相手のコンピュータに到達できるかを確認するコマンド</li>
                <li>郵便で例えると、手紙が正しい住所に届くかの確認</li>
                <li>ネットワークの疎通確認に使用される</li>
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
    gameState.resetProblem();
    initializeGame();
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

document.getElementById('result-modal').onclick = function(event) {
    if (event.target === this) {
        closeResultModal();
    }
};

// ドラッグ終了イベントの追加
document.addEventListener('DOMContentLoaded', function() {
    const draggableElements = document.querySelectorAll('[draggable="true"]');
    draggableElements.forEach(element => {
        element.addEventListener('dragend', dragEnd);
    });
    
    showScreen('menu');
    updateStageSelect();
});