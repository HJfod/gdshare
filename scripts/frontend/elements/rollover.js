class RollOver extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.txt = this.querySelector("roll-text");
        this.con = this.querySelector("roll-content");

        this.txt.addEventListener("click", () => this.roll());
        
        /*
        this.con.style.setProperty("--max", `${this.con.offsetHeight}px`);

        this.con.style.setProperty("--min", `0px`); //*/

        this.trans = false;
        this.con.addEventListener("transitionend", () => {
            this.trans = false;
        });
    }

    roll(force = null) {
        if (!this.trans) {
            if (this.txt.hasAttribute("rolled")) {
                //this.con.style.setProperty("--max", `${this.con.offsetHeight}px`);
    
                this.txt.removeAttribute("rolled");
            } else {
                this.txt.setAttribute("rolled","");
            }

            if (force !== null) {
                force ? this.txt.setAttribute("rolled", "") : this.txt.removeAttribute("rolled");
            }
            
            this.trans = true;
        }
    }

    click() {
        this.roll();
    }
}

customElements.define('roll-over', RollOver);