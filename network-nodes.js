// ネットワークノードクラス
class NetworkNode {
    constructor(x, y, name, type) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.type = type; // 'router', 'destination', 'ip-address', 'subnet'
        this.size = 50;
        this.selected = false;
        this.hovered = false;
    }

    draw(ctx) {
        const centerX = this.x + this.size/2;
        const centerY = this.y + this.size/2;

        // ノードの描画
        ctx.fillStyle = this.getColorByType();
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.size/2, 0, Math.PI * 2);
        ctx.fill();

        // 枠線
        ctx.strokeStyle = this.selected ? '#FF0000' : '#000';
        ctx.lineWidth = this.hovered ? 3 : 2;
        ctx.stroke();

        // アイコンの描画
        this.drawIcon(ctx, centerX, centerY);

        // 名前の描画
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px MS Gothic';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, centerX, this.y + this.size + 15);
    }

    drawIcon(ctx, centerX, centerY) {
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let icon;
        switch (this.type) {
            case 'router':
                icon = '📮'; // 郵便局アイコン
                break;
            case 'destination':
                icon = '🏠'; // 家アイコン
                break;
            case 'ip-address':
                icon = '🏷️'; // タグアイコン
                break;
            case 'subnet':
                icon = '🌐'; // ネットワークアイコン
                break;
            default:
                icon = '?';
        }

        // フォールバック用の図形描画
        if (icon === '📮' || icon === '🏠' || icon === '🏷️' || icon === '🌐') {
            // 絵文字が表示されない場合の代替
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 12px MS Gothic';
            
            switch (this.type) {
                case 'router':
                    ctx.fillText('R', centerX, centerY);
                    break;
                case 'destination':
                    ctx.fillText('D', centerX, centerY);
                    break;
                case 'ip-address':
                    ctx.fillText('IP', centerX, centerY);
                    break;
                case 'subnet':
                    ctx.fillText('S', centerX, centerY);
                    break;
            }
        } else {
            ctx.fillText(icon, centerX, centerY);
        }
    }

    getColorByType() {
        switch (this.type) {
            case 'router':
                return '#FFA500'; // オレンジ
            case 'destination':
                return '#228B22'; // 緑
            case 'ip-address':
                return '#4682B4'; // 青
            case 'subnet':
                return '#9370DB'; // 紫
            default:
                return '#808080'; // グレー
        }
    }

    contains(mouseX, mouseY) {
        const dx = mouseX - (this.x + this.size/2);
        const dy = mouseY - (this.y + this.size/2);
        return Math.sqrt(dx * dx + dy * dy) <= this.size/2;
    }

    setHovered(hovered) {
        this.hovered = hovered;
    }

    setSelected(selected) {
        this.selected = selected;
    }
}