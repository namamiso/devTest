// メインゲームクラス
class NetworkGame {
    constructor(stageNumber) {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stageNumber = stageNumber;
        this.currentProblem = 1;
        this.totalProblems = 3;
        this.selectedAnswer = null;
        this.gameCompleted = false;
        this.progress = 0;

        this.setupEventListeners();
        this.initializeStage();
        this.gameLoop();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    initializeStage() {
        this.gameCompleted = false;
        this.progress = 0;
        this.selectedAnswer = null;
        this.updateProgress();

        switch (this.stageNumber) {
            case 1:
                this.initializeStage1();
                break;
            case 2:
                this.initializeStage2();
                break;
            case 3:
                this.initializeStage3();
                break;
        }
    }

    initializeStage1() {
        this.updateHint('A子さんに手紙を出したい...郵便局の行き先を指定してね！');
        
        // 問題データ
        this.problems = [
            {
                title: "大問1：IPアドレス編",
                problemNumber: "問題1-1",
                description: "あなたは、A子さんに手紙を出したい...\n郵便局の行き先を指定してね！",
                explanation: "3つの住所から郵便局（ゴール）の住所を見つける",
                pingExplanation: "pingとは、ネットワーク上で相手のコンピュータに到達できるかを確認するコマンドです",
                character: "前川克樹",
                options: [
                    {
                        id: 1,
                        address: "大阪府大阪市夢洲区未来町一丁目",
                        building: "郵便局",
                        x: 400, y: 150,
                        isCorrect: true
                    },
                    {
                        id: 2,
                        address: "大阪府大阪市夢洲区未来町二丁目",
                        building: "警察",
                        x: 150, y: 280,
                        isCorrect: false
                    },
                    {
                        id: 3,
                        address: "大阪府大阪市夢洲区未来町三丁目",
                        building: "病院",
                        x: 650, y: 280,
                        isCorrect: false
                    }
                ],
                packetPosition: { x: 400, y: 450 }
            }
        ];

        this.currentProblemData = this.problems[this.currentProblem - 1];
    }

    initializeStage2() {
        this.updateHint('複数の経路から最適なルートを選択しよう！');
        // ステージ2の実装は後で追加
    }

    initializeStage3() {
        this.updateHint('サブネットを使ってネットワークを効率的に分割しよう！');
        // ステージ3の実装は後で追加
    }

    handleClick(event) {
        if (this.gameCompleted) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.stageNumber === 1) {
            this.handleStage1Click(x, y);
        }
    }

    handleStage1Click(x, y) {
        const problem = this.currentProblemData;
        
        // 選択肢のクリック判定
        for (let option of problem.options) {
            if (this.isPointInBuilding(x, y, option)) {
                this.selectedAnswer = option.id;
                this.checkAnswer(option);
                return;
            }
        }

        // 中央ボックスのクリック判定
        if (this.isPointInCentralBox(x, y)) {
            if (this.selectedAnswer) {
                this.submitAnswer();
            }
        }
    }

    isPointInBuilding(x, y, option) {
        const buildingWidth = 120;
        const buildingHeight = 60;
        return x >= option.x - buildingWidth/2 && 
               x <= option.x + buildingWidth/2 && 
               y >= option.y - buildingHeight/2 && 
               y <= option.y + buildingHeight/2;
    }

    isPointInCentralBox(x, y) {
        const boxX = 300;
        const boxY = 380;
        const boxWidth = 200;
        const boxHeight = 40;
        return x >= boxX && x <= boxX + boxWidth && 
               y >= boxY && y <= boxY + boxHeight;
    }

    checkAnswer(selectedOption) {
        if (selectedOption.isCorrect) {
            this.updateHint('正解！郵便局を見つけました！');
            this.updateProgress(100);
            this.gameCompleted = true;
            
            setTimeout(() => {
                window.completeStage();
            }, 2000);
        } else {
            this.updateHint(`${selectedOption.building}ではありません。郵便局を探してください！`);
        }
    }

    submitAnswer() {
        const selectedOption = this.currentProblemData.options.find(opt => opt.id === this.selectedAnswer);
        if (selectedOption) {
            this.checkAnswer(selectedOption);
        }
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.canvas.style.cursor = 'default';

        if (this.stageNumber === 1) {
            const problem = this.currentProblemData;
            
            // 建物のホバー判定
            for (let option of problem.options) {
                if (this.isPointInBuilding(x, y, option)) {
                    this.canvas.style.cursor = 'pointer';
                    break;
                }
            }

            // 中央ボックスのホバー判定
            if (this.isPointInCentralBox(x, y)) {
                this.canvas.style.cursor = 'pointer';
            }
        }
    }

    updateHint(text) {
        document.getElementById('hint-text').textContent = text;
    }

    updateProgress(value = this.progress) {
        this.progress = value;
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        progressFill.style.width = value + '%';
        progressText.textContent = `進行度: ${value}%`;
    }

    gameLoop() {
        this.draw();
        
        if (!this.gameCompleted) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    draw() {
        // 背景をクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.stageNumber === 1) {
            this.drawStage1();
        }
    }

    drawStage1() {
        const problem = this.currentProblemData;
        
        // タイトル
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 24px MS Gothic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(problem.title, 500, 40);

        // 問題番号
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.font = 'bold 16px MS Gothic';
        this.ctx.fillText(problem.problemNumber, 500, 70);

        // 問題文
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px MS Gothic';
        const lines = problem.description.split('\n');
        lines.forEach((line, index) => {
            this.ctx.fillText(line, 500, 95 + (index * 18));
        });

        // 建物を描画
        problem.options.forEach(option => {
            this.drawBuilding(option);
        });

        // 接続線を描画
        this.drawConnections(problem);

        // 中央ボックス
        this.drawCentralBox();

        // パケット君
        this.drawPacketCharacter(problem.packetPosition);

        // キャラクター名
        this.ctx.fillStyle = '#4682B4';
        this.ctx.font = 'bold 12px MS Gothic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(problem.character, 500, 500);

        // 説明文
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px MS Gothic';
        this.ctx.fillText(problem.explanation, 500, 530);

        // ping説明
        this.ctx.fillStyle = '#888';
        this.ctx.font = '10px MS Gothic';
        this.ctx.fillText(problem.pingExplanation, 500, 550);
    }

    drawBuilding(option) {
        const buildingWidth = 120;
        const buildingHeight = 60;
        const x = option.x - buildingWidth/2;
        const y = option.y - buildingHeight/2;

        // 建物の背景
        this.ctx.fillStyle = option.isCorrect ? '#E8F5E8' : '#F0F0F0';
        if (this.selectedAnswer === option.id) {
            this.ctx.fillStyle = option.isCorrect ? '#C8E6C9' : '#FFCDD2';
        }
        this.ctx.fillRect(x, y, buildingWidth, buildingHeight);

        // 建物の枠線
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, buildingWidth, buildingHeight);

        // 建物名
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 14px MS Gothic';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(option.building, option.x, option.y + 5);

        // 住所
        this.ctx.fillStyle = '#666';
        this.ctx.font = '10px MS Gothic';
        const addressLines = this.wrapText(option.address, 100);
        addressLines.forEach((line, index) => {
            this.ctx.fillText(line, option.x, option.y - 30 + (index * 12));
        });
    }

    drawConnections(problem) {
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 2;

        // 各建物から中央ボックスへの線
        problem.options.forEach(option => {
            this.ctx.beginPath();
            this.ctx.moveTo(option.x, option.y + 30);
            this.ctx.lineTo(400, 360);
            this.ctx.stroke();
        });

        // 中央ボックスからパケット君への線
        this.ctx.beginPath();
        this.ctx.moveTo(400, 420);
        this.ctx.lineTo(problem.packetPosition.x, problem.packetPosition.y - 20);
        this.ctx.stroke();
    }

    drawCentralBox() {
        const boxX = 300;
        const boxY = 380;
        const boxWidth = 200;
        const boxHeight = 40;

        // ボックスの背景
        this.ctx.fillStyle = this.selectedAnswer ? '#E3F2FD' : '#F5F5F5';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // ボックスの枠線
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // テキスト
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 12px MS Gothic';
        this.ctx.textAlign = 'center';
        const text = this.selectedAnswer ? '選択済み - クリックして送信' : '住所から郵便局を探す';
        this.ctx.fillText(text, boxX + boxWidth/2, boxY + boxHeight/2 + 4);
    }

    drawPacketCharacter(position) {
        // パケット君（赤い人形）
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, 15, 0, Math.PI * 2);
        this.ctx.fill();

        // 顔
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(position.x - 5, position.y - 3, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(position.x + 5, position.y - 3, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 口
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y + 3, 5, 0, Math.PI);
        this.ctx.stroke();
    }

    wrapText(text, maxWidth) {
        const words = text.split('');
        const lines = [];
        let currentLine = '';

        for (let word of words) {
            const testLine = currentLine + word;
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    reset() {
        this.initializeStage();
    }

    destroy() {
        this.gameCompleted = true;
    }
}