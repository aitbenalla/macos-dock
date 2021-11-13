/**
 * 
 * @param {number} val 
 * @param {number} min 
 * @param {number} max 
 * @return {number}
 */
function between(val, min, max) {
    return Math.max(min, Math.min(val, max));
}

/**
 * 
 * @param {number} d 
 */
function scaling(d) {
    return Math.max(Math.min(-0.2 * Math.pow(d, 2) + 1.05, 1), 0);
}

const TransformOrigins = {
    '0': 'center',
    '-1': 'right',
    '1': 'left'
}

/**
 * @property {HTMLElement} root
 * @property {HTMLElement[]} icons
 * @property {number} iconSize
 * @property {number} mousePosition
 */
class Dock {

    scale = 1;

    /**
     * 
     * @param {HTMLElement} el 
     */
    constructor(el) {
        this.root = el;
        this.icons = Array.from(el.children);
        if (this.icons.length === 0) {
            return;
        }
        this.iconSize = this.icons[0].offsetWidth;

        el.addEventListener('mousemove', this.handleMouseMove.bind(this));
        el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        el.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handleMouseMove(e) {
        this.mousePosition = between((e.clientX - this.root.offsetLeft) / this.iconSize, 0, this.icons.length);
        this.scaleIcons();
    }

    scaleIcons() {
        const selectedIndex = Math.floor(this.mousePosition);
        const centerOffset = this.mousePosition - selectedIndex - 0.5;
        let baseOffset = this.scaleIconsFromDirection(selectedIndex, 0, -centerOffset * this.iconSize);
        let offset = baseOffset * (0.5 - centerOffset);
        for (let index = selectedIndex + 1; index < this.icons.length; index++) {
            offset += this.scaleIconsFromDirection(index, 1, offset)
        }
        offset = baseOffset * (0.5 + centerOffset);
        for (let index = selectedIndex - 1; index >= 0; index--) {
            offset += this.scaleIconsFromDirection(index, -1, -offset)
        }
    }

    /**
     * 
     * @param {number} index 
     * @param {number} direction (0:center, -1:right, 1:left)
     * @param {number} offset 
     */
    scaleIconsFromDirection(index, direction, offset) {
        const center = index + 0.5;
        const distance = this.mousePosition - center;
        const scale = scaling(distance * this.scale);
        const icon = this.icons[index];
        icon.style.setProperty('transform', `translateX(${offset}px) scale(${scale + 1})`);
        icon.style.setProperty('transform-origin', `${TransformOrigins[direction.toString()]} bottom`);
        return scale * this.iconSize;
    }

    handleMouseLeave() {
        this.root.classList.remove('animated');
        this.icons.forEach((icon) => {
            icon.style.removeProperty('transform');
            icon.style.removeProperty('transform-origin');
        });
    }

    handleMouseEnter() {
        this.root.classList.add('animated');
        window.setTimeout(() => {
            this.root.classList.remove('animated');
        },100)
    }
}

new Dock(document.querySelector('.dock'));