const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const playables = [
  {
    NOME: "Mario",
    VELOCIDADE: 4,
    MANOBRABILIDADE: 3,
    PODER: 3,
    PONTOS: 0
  },
  {
    NOME: "Peach",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 2,
    PONTOS: 0,
  },
  {
    NOME: "Yoshi",
    VELOCIDADE: 2,
    MANOBRABILIDADE: 4,
    PODER: 3,
    PONTOS: 0,
  },
  {
    NOME: "Bowser",
    VELOCIDADE: 5,
    MANOBRABILIDADE: 2,
    PODER: 5,
    PONTOS: 0,
  },
  {
    NOME: "Luigi",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 4,
    PONTOS: 0,
  },
  {
    NOME: "Donkey Kong",
    VELOCIDADE: 2,
    MANOBRABILIDADE: 2,
    PODER: 5,
    PONTOS: 0,
  }
];

const player1 = {
  NOME: "",
  VELOCIDADE: 0,
  MANOBRABILIDADE: 0,
  PODER: 0,
  PONTOS: 0,
};

const player2 = {
  NOME: "",
  VELOCIDADE: 0,
  MANOBRABILIDADE: 0,
  PODER: 0,
  PONTOS: 0,
};

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

//rodando para pegar casco ou bomba
async function rollShellBomb(){
  return Math.floor(Math.random() * 2) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;
    case random < 0.66:
      result = "CURVA";
      break;
    default:
      result = "CONFRONTO";
  }

  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${
      diceResult + attribute
    }`
  );
}

async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);

    // sortear bloco
    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    // rolar os dados
    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    //teste de habilidade
    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;

    if (block === "RETA") {
      totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
      totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

      await logRollResult(
        character1.NOME,
        "velocidade",
        diceResult1,
        character1.VELOCIDADE
      );

      await logRollResult(
        character2.NOME,
        "velocidade",
        diceResult2,
        character2.VELOCIDADE
      );
    }

    if (block === "CURVA") {
      totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
      totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

      await logRollResult(
        character1.NOME,
        "manobrabilidade",
        diceResult1,
        character1.MANOBRABILIDADE
      );

      await logRollResult(
        character2.NOME,
        "manobrabilidade",
        diceResult2,
        character2.MANOBRABILIDADE
      );
    }

    if (block === "CONFRONTO") {
      let powerResult1 = diceResult1 + character1.PODER;
      let powerResult2 = diceResult2 + character2.PODER;

      console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);

      await logRollResult(
        character1.NOME,
        "poder",
        diceResult1,
        character1.PODER
      );

      await logRollResult(
        character2.NOME,
        "poder",
        diceResult2,
        character2.PODER
      );

      if (powerResult1 > powerResult2) {
        if(character2.PONTOS > 0){
          let textConfrontWinner = `${character1.NOME} venceu o confronto!`;
          let pointsLost = 1;
          const shellBomb = await rollShellBomb();

          // tratar do casco ou bomba
          switch(shellBomb){
            case 1:
              textConfrontWinner += `\n${character1.NOME} jogou um casco 🐢. ${character2.NOME} perdeu 1 ponto`;
              pointsLost = 1;
              break;
            default:
              textConfrontWinner += `\n${character1.NOME} jogou uma bomba 💣. ${character2.NOME} perdeu 2 pontos`;
              pointsLost = 2;
              break;
          }

          console.log(textConfrontWinner);
          character2.PONTOS -= pointsLost;

          character2.PONTOS = character2.PONTOS < 0 ? 0 : character2.PONTOS;
        }
        const luckTurbo = await rollDice();

        if(luckTurbo === 6){
          console.log(`SORTE CRÍTICA! ${character1.NOME} ganhou turbo, marcando mais um ponto 🚀`);
          character1.PONTOS++;
        }
      }

      if (powerResult2 > powerResult1) {
        if(character1.PONTOS > 0){
          let textConfrontWinner = `${character2.NOME} venceu o confronto!`;
          let pointsLost = 1;
          const shellBomb = await rollShellBomb();

          // tratar do casco ou bomba
          switch(shellBomb){
            case 1:
              textConfrontWinner += `\n${character2.NOME} jogou um casco 🐢. ${character1.NOME} perdeu 1 ponto`;
              pointsLost = 1;
              break;
            default:
              textConfrontWinner += `\n${character2.NOME} jogou uma bomba 💣. ${character1.NOME} perdeu 2 pontos`;
              pointsLost = 2;
              break;
          }

          console.log(textConfrontWinner);
          character1.PONTOS -= pointsLost;

          character1.PONTOS = character1.PONTOS < 0 ? 0 : character1.PONTOS;
        }
        const luckTurbo = await rollDice();

        if(luckTurbo === 6){
          console.log(`SORTE CRÍTICA! ${character2.NOME} ganhou turbo, marcando mais um ponto 🚀`);
          character2.PONTOS++;
        }
      }

      console.log(
        powerResult2 === powerResult1
          ? "Confronto empatado! Nenhum ponto foi perdido"
          : ""
      );
    }

    // verificando o vencedor
    if (totalTestSkill1 > totalTestSkill2) {
      console.log(`${character1.NOME} marcou um ponto!`);
      character1.PONTOS++;
    } else if (totalTestSkill2 > totalTestSkill1) {
      console.log(`${character2.NOME} marcou um ponto!`);
      character2.PONTOS++;
    }

    console.log("-----------------------------");
  }
}

async function declareWinner(character1, character2) {
  console.log("Resultado final:");
  console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
  console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

  if (character1.PONTOS > character2.PONTOS)
    console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
  else if (character2.PONTOS > character1.PONTOS)
    console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
  else console.log("A corrida terminou em empate");
}

async function askCharacter(texto){
  readline.question(texto, async (resposta) => {
    if (resposta.trim() === '') {
      texto = "Selecione um personagem válido:\n1 - Mario \n2 - Peach\n3 - Yoshi\n4 - Bowser\n5 - Luigi\n6 - Donkey Kong\n";

      askCharacter(texto);
    } else {
      let respostaConvertida = Number(resposta);

      if (typeof respostaConvertida === 'number' && !isNaN(respostaConvertida)) {
        if(respostaConvertida <= 0 || respostaConvertida > 6){
          texto = "Selecione um personagem válido:\n1 - Mario \n2 - Peach\n3 - Yoshi\n4 - Bowser\n5 - Luigi\n6 - Donkey Kong\n";

          askCharacter(texto);
        } else {
          Object.assign(player1, playables.at(respostaConvertida - 1));

          playables.splice(respostaConvertida - 1, 1);

          let randomNumber = Math.floor(Math.random() * 5) + 1;

          Object.assign(player2, playables.at(randomNumber - 1));

          console.log(`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);

          await playRaceEngine(player1, player2);
          await declareWinner(player1, player2);

          readline.close();
        }
      } else {
        console.log(`"${resposta}" não é um personagem válido.\n`);
        texto = "Selecione um personagem válido:\n1 - Mario \n2 - Peach\n3 - Yoshi\n4 - Bowser\n5 - Luigi\n6 - Donkey Kong\n";

        askCharacter(texto);
      }
    }
  });
}

(async function main() {
  let texto = "🏁 Uma corrida se iniciará, selecione um personagem de 1 a 6:";
  texto += "\n1 - Mario \n2 - Peach\n3 - Yoshi\n4 - Bowser\n5 - Luigi\n6 - Donkey Kong\n";

  await askCharacter(texto);
})();
