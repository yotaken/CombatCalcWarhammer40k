const DADOS = {
    DADO_6: '1d6',
    DADO_6_MAS_1: '1d6+1',
    DADO_6_MAS_2: '1d6+2',
    DADO_6_MAS_3: '1d6+3'
};

let modoDebug = false;
let golpesExitosos = 0;
let danioTotal = [];
let defensoresTotalesMuertos = 0;

function tiradaRandomDadoDe6() {
    return Math.floor(Math.random() * 6) + 1;
}

function calcularTiradaMinimaParaHerir(fuerzaAtaque, resistenciaObjetivo) {
    let fuerzaAtaqueEsElDobleDelaResistenciaObjetivo = fuerzaAtaque >= 2 * resistenciaObjetivo;
    if (fuerzaAtaqueEsElDobleDelaResistenciaObjetivo) {
        return 2;
    }
    if (fuerzaAtaque > resistenciaObjetivo) {
        return 3;
    }
    if (fuerzaAtaque === resistenciaObjetivo) {
        return 4;
    }
    if (fuerzaAtaque < resistenciaObjetivo / 2) {
        return 5;
    }
    return 6;
}


function tirarDados(tipoDado = DADOS.DADO_6) {
    switch (tipoDado) {
        case DADOS.DADO_6:
            return tiradaRandomDadoDe6();
        case DADOS.DADO_6_MAS_1:
            return tiradaRandomDadoDe6() + 1;
        case DADOS.DADO_6_MAS_2:
            return tiradaRandomDadoDe6() + 2;
        case DADOS.DADO_6_MAS_3:
            return tiradaRandomDadoDe6() + 3;
    }
}

function calcularTiradaMinimaDeSalvacion(salvacionDefensor, invulnerableSave, penetracionArmadura) {
    let salvacion = salvacionDefensor + penetracionArmadura;
    if (salvacion > invulnerableSave) {
        return invulnerableSave;
    }
    return salvacion;
}

function simularAtaque(
    habilidadAcierto,
    fuerzaArmaAtacante,
    penetracionArmadura,
    numeroAtaques,
    resistenciaDefensor,
    salvacionDefensor,
    danioFijoAtaque = '',
    danioVariable = '',
    invulnerableSave,
    numRepeticiones = 1,
    numDefensores = 1,
    vidaDefensores = 1
) {
    modoDebug ? console.log('\n\n Ronda de ataques') : '';
    for (let repeticionActual = 0; repeticionActual < numRepeticiones; repeticionActual++) {
        let danioTotalRepeticion = [];
        let golpesExitososRepeticionActual = 0;
        for (let numeroAtaqueActual = 0; numeroAtaqueActual < numeroAtaques; numeroAtaqueActual++) {
            const tiradaDisparo = tirarDados();
            let impacta = tiradaDisparo >= habilidadAcierto;
            if (!impacta) {
                modoDebug ? console.log('El ataque num ' + numeroAtaqueActual + ' no ha impactado') : '';
                continue;
            }

            const tiradaHerir = tirarDados();
            let noHiere = tiradaHerir === 1;
            if (noHiere) {
                modoDebug ? console.log('El ataque num ' + numeroAtaqueActual + ' no ha herido') : '';
                continue;
            }

            const tiradaMinimaHerir = calcularTiradaMinimaParaHerir(fuerzaArmaAtacante, resistenciaDefensor);
            if (tiradaHerir < tiradaMinimaHerir) {
                modoDebug ? console.log('El ataque num ' + numeroAtaqueActual + ' ha fallado la tirada de herir') : '';
                continue;
            }

            const tiradaSalvacion = tirarDados();
            let puedeTirarSalvacion = tiradaSalvacion !== 1;
            const minTiradaSalvacion = calcularTiradaMinimaDeSalvacion(salvacionDefensor, invulnerableSave, penetracionArmadura);
            if (puedeTirarSalvacion && (tiradaSalvacion >= minTiradaSalvacion)) {
                modoDebug ? console.log('El ataque num ' + numeroAtaqueActual + ' ha sido salvado por el defensor') : '';
                continue;
            }
            let danioDelAtaqueActual = tirarDados(danioVariable);
            if (typeof danioFijoAtaque !== 'undefined' && danioFijoAtaque.length > 0) {
                danioDelAtaqueActual = parseInt(danioFijoAtaque);
            }
            danioTotal[golpesExitosos++] = danioDelAtaqueActual;
            danioTotalRepeticion[golpesExitososRepeticionActual++] = danioDelAtaqueActual;
            modoDebug ? console.log('El ataque num ' + numeroAtaqueActual + ' ha inflingido: ' + danioDelAtaqueActual) : '';
        }
        asignarDanioADefensoresEnRepeticionActual(numDefensores, vidaDefensores, danioTotalRepeticion, golpesExitososRepeticionActual);
    }
}

function asignarDanioADefensoresEnRepeticionActual(numDefensores, vidaGeneralDefensores, danioTotalRepeticion, golpesExitososRepeticionActual) {
    if (golpesExitososRepeticionActual < 1) {
        modoDebug ? console.log('No se hace daño a ningún defensor') : '';
        return;
    }
    let vidaActualDefensor = vidaGeneralDefensores;
    let numDefensoresDespuesDeAtaque = numDefensores;
    for (let numGolpeActual = 0; numGolpeActual < golpesExitososRepeticionActual; numGolpeActual++) {
        vidaActualDefensor = vidaActualDefensor - danioTotalRepeticion[numGolpeActual];
        let defensorSeHaMuerto = vidaActualDefensor < 1;
        if (defensorSeHaMuerto) {
            numDefensoresDespuesDeAtaque = numDefensoresDespuesDeAtaque - 1;
            vidaActualDefensor = vidaGeneralDefensores;
            defensoresTotalesMuertos++;
        }
    }
    modoDebug ? console.log('Defensores vivos en repetición actual: ' + numDefensoresDespuesDeAtaque) : '';
    modoDebug ? console.log('Vida último defensor en repetición actual: ' + vidaActualDefensor) : '';
    return [vidaActualDefensor, numDefensoresDespuesDeAtaque];
}

function imprimirResultado() {
    console.log('Golpes no Salvados: ' + golpesExitosos);
    console.log('Total de Daño Infligido: ' + danioTotal);
    console.log('Número de defensores palmaos: ' + defensoresTotalesMuertos);
    golpesExitosos = 0;
    danioTotal = [];
    defensoresTotalesMuertos = 0;
}

