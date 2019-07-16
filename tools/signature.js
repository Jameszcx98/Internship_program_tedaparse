
const { KJUR, hex2b64, KEYUTIL } = require('jsrsasign')

const privateKey =
'-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEA56EG/vKtxZ6UhRKS+GFDWAfnFEMRUvqBCwuJpBlE/OmH6YKKPznTLzwG2tK+6vu6F9Wu2u+mXhSiLiMdDF2Rb5cUW6LuXrAhJaOTUPe6tRL3Zq8JnPAOQOBNrIKJV/y3B1viQf1R7ipNwrJF+MEf/5K3uVn9mPYQgiVVuSQUibPBj2Q8XP4hnfeQ6fMosBEzk9ZlG0ma104gVtegaedrWfhqM6WL0NfLKsptJWfPOnalApVZW0OGJrTXkPS+lTjj0F/AfoP2FaY3A1E2qZcEy9hfD9T4S68g8TlPfVKJUNWmRubuy2FNjCnBpwie2mxe5rIZrZWXRebgD7yCgIhBsQIDAQABAoIBAQCpVFiu7G4IuCNPHQMAPOpkYnKVp2n0xVis4GRg6HA8i+Rl2p6CFh3CvBkuwz36vseOQRIwz11KDb96BwVnUsfNUh751qR36D5zK5+4Y0HEufbOxEs8xWlGGDPwVwVco0ySPqOrJitM9vQdzwHEFjr0NSfGgnkX51quKej/DddNygzciuyL9fsYlG8yb80OuR2ViD/VzH++Xtj0hHhqrDktJcLLw2GiIP2GqRK73MDAxeYftEoq9YHrzWxJ9CFCgJ4KIlrqeaYFCm58MOk7j5UIv9WtBMXuGDO/s1IHVtljoiFzteHmkEn2kr8d/s0v31o58rOeaaHa5vrRMNXScDmhAoGBAP8fTvNbkVlNiD+sw+hyqmZMhYqu8DZ11+mLmu6co5QmsbuK/xjObQ7deUsu55YRnMWTtLaIjvdHiVmow5MFyHPn3aeACAvpZh00zxgIzCdhjLXb6S76fvy64PwUHLlB9yECgpxnvAMR/1sxI9uTndZ9o+JW1PIeMA2p1+AOwPglAoGBAOhtByQOkRcasaPlYJVeCa/dhLKi6ekuA0g6MIRzt7phsbMACNAam7mqDY2dogsc9Aor3qCrGiQlt2Fa/0G7Wf3+oKfvW/2sIsH1aT57jjxtzoyncSFJE33Btx5LZnngv3sHt2GHqKpEqgh/wgOV6Ci29ObUeZO+Xu+X2vUp1dedAoGBAOkA4Ct08t/b5tc448gViblapBCQS4WBxUtgnITW/LMfT+4YOXmfdo1ACzp2QT6XIVZ123NmbyQ66p+/ebd6baQmHROQ5Eh0xzVfeNDboBFLj6a8jVDBqV8LEtZHTCCKtbkpQL62I0muk0jnLXeqb1ppb1cVtPDYT0z7VNUmxGkdAoGAWV4qo7uSIC8cZKd6xpP854kmT8WCaS1PB8OQCi2wVFLiD7CQsuu4OuBfC7ezqdA9KXgKxv5jM8joxN9HTI/sH1R7k3beiSBZ0Pg6ulKpsySJid2MCz9c5jrI3TYitfQry/OAmFigCrASLOhqwhQuyxDmA6dpA9zsBfX+s8udNKUCgYBgVt5KP6GorEICmSbOR0agARTxFHgX9Sp1NpLgxu4roNxqGNNBzJ4HpDyah3bG9q4sOp5d1NPAGVec+WjNPw2zp3R5MG39egE/RcHbYwKQZlV1aXlzWPbsEgABjJD37T/dx2GeUVG6wSOk1iKuqZDQt/I9WzQP8Fph89BngaZPcg==-----END RSA PRIVATE KEY-----'

let appKey = 'fclyd5JSDfSAwvvlYzgTWVg3xmLU0qIC'

const Signature = function (rawParams){
	
	const orderedParams = {}

	Object.keys(rawParams)
			.sort()
			.forEach(key => {
					orderedParams[key] = rawParams[key]
			})
	console.log('排序后的字典' + JSON.stringify(orderedParams))
	
	let ary = []
	for (let i in orderedParams) {
			ary.push(i + '=' + orderedParams[i])
	}
	console.log('转化后的数组' + JSON.stringify(ary))
	
	let final = ary.join('&') + appKey
	console.log('最终' + JSON.stringify(final))
	
	let keyobj = KEYUTIL.getKey(privateKey)
	// console.log('读取Key keyobj' + keyobj);
	
	let pkcs8pem = KEYUTIL.getPEM(keyobj, 'PKCS8PRV')
	
	// console.log('转化为pkcs8pem' + pkcs8pem);
	
	const sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' }) // 实例化一个新签名函数
	sig.init(pkcs8pem)
	sig.updateString(final)
	let signResult = sig.sign()
	let bn64Result = hex2b64(signResult)

	return bn64Result
}


module.exports = { 
	Signature
}
