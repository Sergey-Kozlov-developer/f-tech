// import IBase from '@/components/Base'
// import { StateClass } from '@/constants'
// import { $, type JQuery } from '@/utils/JQuery'
// import { type Selectors } from '@/components/Header/types'

class Header {
    // находим селекторы
    // позволяет нам обращаться к св-вам объекта а не к строчным данным
    selectors = {
        root: '[data-js-header]', // корневой селектор
        overlay: '[data-js-header-overlay]',
        burgerButton: '[data-js-header-burger-button]',
    }
    // состояние активно или нет
    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.overlayElement = this.rootElement.querySelector(this.selectors.overlay)
        this.burgerButtonElement = this.rootElement.querySelector(this.selectors.burgerButton)
        this.bindEvents()
    }
    // при клике меняем состояния
    onBurgerButtonClick = () => {
        this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
        this.overlayElement.classList.toggle(this.stateClasses.isActive)
        document.documentElement.classList.toggle(this.stateClasses.isLock)
        // console.log(this.overlayElement)
    }
    // привязываем прослушку клика при нажатии на burgerButton
    bindEvents() {
        this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick)
    }
}
export default Header
