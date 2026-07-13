function campo(id, valor) {
	const texto = String(valor);
	const tamanho = Buffer.byteLength(texto, 'utf8');
	if (tamanho > 99) throw new Error(`Campo Pix ${id} excede o tamanho permitido.`);
	return `${id}${String(tamanho).padStart(2, '0')}${texto}`;
}

function textoPix(valor, limite) {
	return String(valor || '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^A-Za-z0-9 ]/g, '')
		.trim()
		.toUpperCase()
		.slice(0, limite);
}

function crc16(payload) {
	let crc = 0xffff;

	for (const byte of Buffer.from(payload, 'utf8')) {
		crc ^= byte << 8;
		for (let bit = 0; bit < 8; bit += 1) {
			crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1;
			crc &= 0xffff;
		}
	}

	return crc.toString(16).toUpperCase().padStart(4, '0');
}

function gerarPixCopiaECola({ chave, valor, pedidoId, beneficiario, cidade }) {
	const chaveNormalizada = String(chave || '').trim();
	if (!chaveNormalizada) throw new Error('Chave Pix não configurada.');

	const conta = [
		campo('00', 'BR.GOV.BCB.PIX'),
		campo('01', chaveNormalizada),
	].join('');

	const adicionais = campo('05', textoPix(`MUTTI${pedidoId}`, 25) || '***');
	const payloadSemCrc = [
		campo('00', '01'),
		campo('26', conta),
		campo('52', '0000'),
		campo('53', '986'),
		campo('54', Number(valor).toFixed(2)),
		campo('58', 'BR'),
		campo('59', textoPix(beneficiario, 25) || 'MUTTIFLOW'),
		campo('60', textoPix(cidade, 15) || 'SAO PAULO'),
		campo('62', adicionais),
		'6304',
	].join('');

	return `${payloadSemCrc}${crc16(payloadSemCrc)}`;
}

module.exports = { gerarPixCopiaECola };
