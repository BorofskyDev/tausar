import gsap from 'gsap'

const bar = document.querySelector('.loading__bar--inner')
const counterNumber = document.querySelector('.loading__counter--number')

let c = 0

let barInterval = setInterval(() => {
    bar.style.width = c + '%'
    counterNumber.innerText = c + '%'
    c++
    if (c === 101) {
        clearInterval(barInterval)
        gsap.to('.loading__bar', {
            duration: 8,
            rotate: "90deg",
            left: '1000%'
        })
        gsap.to('.loading__text, .loading__counter', {
            duration: .5,
            opacity: 0,
        })
        gsap.to('.loading__box', {
            duration: 1,
            height: '500px',
            borderRadius: '50%',
        })
        gsap.to('.loading__img', {
            duration: 10,
            opacity: 1,
            rotate: '360deg',
        })
        gsap.to('.loading__box', {
            delay: 2,
            border: 'none'
        })
        gsap.to('.loading', {
            delay: 2,
            duration: 2,
            // zIndex: 1,
            background: 'transparent',
            opacity: .5,
        })
        gsap.to('.loading__img', {
            delay: 2,
            duration: 100,
            rotate: '360deg',
        })
    }

}, 20)

