// Selecionando os botões
const btnList = document.querySelectorAll('.car-buttons button');

// Selecionando o carro e o homem
const car = document.querySelector('.car');
const man = document.querySelector('.man');

// Largura da tela
const widthLimit = window.screen.width;

// Largura do carro e do homem
const carSize = car.clientWidth;
const manSize = man.clientWidth;

// Desabilitando o botão parar
disableControl(false, 'stop');

// Configurando o carro
setSettings(car, 'width', '150px');
setSettings(car, 'position', 'absolute');
setSettings(car, 'left', '5%');

//Configurando o homem
setSettings(man, 'width', '120px');
setSettings(man, 'position', 'absolute');
setSettings(man, 'left', '50%');

// Função para configurar o estilo de um elemento e atribuir um valor
function setSettings(element, prop, value) {
  // Desestruturando o elemento para acessar os estilos
  const { style } = element;
  // Atribuindo o valor
  style[prop] = value;
}

// Adicionando evento de click em cada botão
btnList.forEach((btn) => {
  btn.addEventListener('click', handleClick);
});

// Função acionada ao clicar em algum dos botões
function handleClick({ target }) {
  // Desestruturando o elemento para identificar a classe do botão clicado
  const { className } = target;

  // Identificando o botão que foi clicado com base no nome de classe
  if (className === 'right') {
    // Habilitando o botão parar e desabilitando os demais botôes
    disableControl(true, 'stop');
    // Movimentando o carro
    moveCar('left', 30, 100);
  }
  if (className === 'left') {
    // Habilitando o botão parar e desabilitando os demais botôes
    disableControl(true, 'stop');
    // Movimentando o carro
    moveCar('left', -30, 100);
  }
  if (className === 'stop') {
    // Adicionado classe ativo para forçar a parada do carro
    target.classList.add('ativo');
  }
}

// Função para movimentar o carro
function moveCar(direction, velocity, aceleration) {
  // Armazenando posição atual do carro
  let position = checkPosition(car);
  // Verificando se a velocidade foi positiva ou negativa para movimentar o carro no sentido correto
  if (velocity > 0) {
    // Acionando repetição com base na direção, velocidade e aceleração inseridos na função
    const movingPositive = setInterval(() => {
      // Verificando se a posição do carro em relação a largura da tela e se o botão parar foi acionado atraves da classe.
      if (
        position <= widthLimit - carSize &&
        !btnList[1].className.includes('ativo')
      ) {
        // Chamando a função que verifica a colisão
        aboutToCrash();
        // Mudando posição do carro para movimenta-lo, somando o valor da velocidade com a posição atualizada do carro.
        setSettings(car, direction, `${(position += velocity)}px`);
      } else {
        // Parando a repetição (Parando o carro)
        clearInterval(movingPositive);
        // Desabilitando o botão parar
        disableControl(false, 'stop');
        // Removendo a classe ativo do botão parar
        btnList[1].classList.remove('ativo');
      }
    }, aceleration);
  } else {
    // Acionando repetição com base na direção, velocidade e aceleração inseridos na função
    const movingNegative = setInterval(() => {
      // Verificando se a posição em relação ao inicio da tela e se o botão parar foi acionado atraves da classe.
      if (position >= 0 && !btnList[1].className.includes('ativo')) {
        // Mudando posição do carro para movimenta-lo, somando o valor da velocidade com a posição atualizada do carro.
        setSettings(car, direction, `${(position += velocity)}px`);
      } else {
        // Parando a repetição (Parando o carro)
        clearInterval(movingNegative);
        // Desabilitando o botão parar
        disableControl(false, 'stop');
        // Removendo a classe ativo do botão parar
        btnList[1].classList.remove('ativo');
      }
    }, aceleration);
  }
}

// Função que verifica e retorna posição do elemento no eixo x
function checkPosition(element) {
  let position = element.getBoundingClientRect().x;
  return position;
}

// Função para habilitar e desabilitar os botões
function disableControl(disabled, exception) {
  // Verifica se é para habilitar ou desabilitar os botões com base na informação booleana inserida na função
  if (disabled) {
    // Selecionando cada botão
    btnList.forEach((btn) => {
      // Excluindo exceção inserida na função
      if (!btn.className.includes(exception)) {
        // Desabilitando botão
        btn.setAttribute('disabled', '');
        // Habilitando botão (exceção)
      } else btn.removeAttribute('disabled');
    });
  }
  // Verifica se é para habilitar ou desabilitar os botões com base na informação booleana inserida na função
  if (!disabled) {
    // Selecionando cada botão
    btnList.forEach((btn) => {
      // Excluindo exceção inserida na função
      if (!btn.className.includes(exception)) {
        // Habilita botão
        btn.removeAttribute('disabled');
        // Desabilitando botão (exceção)
      } else btn.setAttribute('disabled', '');
    });
  }
}

// Função que verifica a colisão
function aboutToCrash() {
  // Armazenando a posição do carro e do homem
  let carPosition = checkPosition(car);
  let manPosition = checkPosition(man);
  // Verificando se o carro e homem estão prestes a colidir
  if (carPosition >= manPosition - carSize) {
    // Parando o carro
    btnList[1].classList.add('ativo');
    // Inserindo confirmação para decidir se deseja atropelar ou não o homem
    if (confirm('Você deseja atropelar o cidadão?')) {
      // Retirando homem da tela
      setSettings(man, 'display', 'none');
      // Alterando imaagem do carro para imagem do carro colidindo com homem
      car.src = './img/carcrash.png';
      // Alterando configuração para nova imagem
      setSettings(car, 'width', '200px');
      setSettings(car, 'top', '180px');
      // Acionando repetição do carro em colisão
      const carMovement = setInterval(() => {
        // Desabilitando todos os botões
        disableControl(true);
        // Verificando posição do carro
        let position = checkPosition(car);
        // Verificando se a imagem saiu da tela
        if (position <= widthLimit) {
          // Movimentando o carro em colisão
          setSettings(car, 'left', `${(position += 30)}px`);
        } else {
          // Parando repetição
          clearInterval(carMovement);
        }
      }, 100);
    } else {
      // Alterando imagem do homem
      man.src = './img/wings.png';
      // Acionando repetição do homem
      const manMovement = setInterval(() => {
        // Armazenando posição do homem no eixo y
        let position = man.getBoundingClientRect().y;
        // Desabilitando todos os botões
        disableControl(true);
        // Verificando se a imagem saiu da tela
        if (position >= -man.clientHeight) {
          // Movimentando o homem
          setSettings(man, 'top', `${(position -= 30)}px`);
        } else {
          // Parando repetição
          clearInterval(manMovement);
          // Acionando repetição do carro
          const carMovement = setInterval(() => {
            // Verificando posição do carro
            let position = checkPosition(car);
            // Verificando se a imagem saiu da tela
            if (position <= widthLimit) {
              // Movimentando o carro
              setSettings(car, 'left', `${(position += 30)}px`);
            } else {
              // Parando repetição
              clearInterval(carMovement);
            }
          }, 100);
        }
      }, 100);
    }
  }
}
