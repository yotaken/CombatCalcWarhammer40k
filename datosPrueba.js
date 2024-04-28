function datosPrueba() {
    const habilidadAcierto = 3;
    const fuerzaArmaAtacante = 7;
    const penetracionArmadura = 1;
    const numeroAtaques = 6;
    const resistenciaDefensor = 5;
    const salvacionDefensor = 2;
    const danoFijoAtaque = '';
    const danioVariable = '1d6+1';
    const invulnerableSave = 4;
    const numRepeticiones = 2;
    const numDefensores = 5;
    const vidaDefensores = 4;
    simularAtaque(
        habilidadAcierto,
        fuerzaArmaAtacante,
        penetracionArmadura,
        numeroAtaques,
        resistenciaDefensor,
        salvacionDefensor,
        danoFijoAtaque,
        danioVariable,
        invulnerableSave,
        numRepeticiones,
        numDefensores,
        vidaDefensores
    );
    imprimirResultado();
}