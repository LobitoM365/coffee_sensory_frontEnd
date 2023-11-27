const inputs = document.querySelectorAll('.input-text');
const spanInputs = document.querySelectorAll('.span-input')
const credentialError = document.querySelectorAll('.credentials-error')

for (let i = 0; i < inputs.length; i++) {

    inputs[i].addEventListener('focus', function () {
        inputs[i].classList.remove('input-error')

        inputs[i].style.border = '1px solid green'
        spanInputs[i].classList.add('container-inputs-span')
        spanInputs[i].classList.remove('span-input')
        inputs[i].placeholder = ''
    })

    inputs[i].addEventListener('blur', function () {
        if (inputs[i].value == '') {
            inputs[i].style.border = '1px solid #ccc'
            setTimeout(() => {
                if (i == 0) {
                    inputs[i].placeholder = 'Correo Electronico'
                } else {
                    inputs[i].placeholder = 'Contraseña'
                }
            }, 100)
            spanInputs[i].classList.remove('container-inputs-span')
            spanInputs[i].classList.add('span-input')

        }

    })

}