'use strict';

String.prototype.format = function () {
    var values = arguments;
    return this.replace(/\{(\d+)\}/g, function (match, index) {
        if (values.length > index) {
            return values[index];
        } else {
            return "";
        }
    });
};

Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    var number = this;
    // if(number < 0.00001) {
    // 	return parseFloat(0);
    // }
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    var need = 0;
    if(n ==3) {
    	need = 0.0001;
    } else if(n == 4) {
    	need = 0.00001;
    } else if(n == 5) {
    	need = 0.000001;
    } else if(n == 6) {
    	need = 0.0000001;
    } else if(n == 7) {
    	need = 0.00000001;
    } else if(n == 8) {
    	need = 0.000000001;
    }

    number += need;

    let result = number.toString();
    const arr = result.split('.');
    // 整数的情况
    if (arr.length < 2) {
        return result;
    }
    const integer = arr[0];
    var decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    return parseFloat(result);
};

Number.prototype.toDexShow = function() {
	var number = this;
	if(number >= 1000000000000) {
		number /= 1000000000000;
		return number.toFixed(3) + "T";
	} else if(number >= 1000000000) {
		number /= 1000000000;
		return number.toFixed(3) + "G";
	} else if(number >= 1000000) {
		number /= 1000000;
		return number.toFixed(3) + "M";
	} else if(number >= 1000) {
		number /= 1000;
		return number.toFixed(3) + "K";
	}
	return number.toFixed(4);
}

var System = {
	chain: '',
	accName: '',
	addr: '',
	priv: ''
};

var is_eth_addr = function is_eth_addr(addr) {
	var re = /^0x[a-fA-F0-9]{40,40}/;
	return re.test(addr);
};

var is_olink_addr = function(addr) {
	var re = /^0x[a-fA-F0-9]{40,40}/;
	return re.test(addr);
};

var is_priv_key = function(priv) {
	var re = /^0x[a-fA-F0-9]{64,64}/;
	return re.test(priv);
};

var is_number = function is_number(val) {
	var re = /^([0-9]+)|([0-9]+\.[0-9]+)/;
	return re.test(val);
};

var is_float_number = function is_float_number(val) {
	var re = /^[0-9]+\.[0-9]+/;
	return re.test(val);
};

var is_int = function is_int(val) {
	var re = /^[0-9]+/;
	return re.test(val);
};

var is_valid_router = function(link) {
	var re = /^http:\/\//;
	return re.test(link);
}

var validPass = function(pass) {
	var regu = /\w*[0-9]+\w*$/;
    var regu2 = /\w*[a-zA-Z]+\w*$/;
    
    if(pass.length < 6 || pass.length > 20) {
    	return false;
    }
    if (!regu.test(pass) || !regu2.test(pass)) {
        return false;
    }
    return true;
}

var validName = function(name) {
	if(name.length > 15) {
		return false;
	}
	return true;
}

///////////// finger auth
var setFingerAuth = function() {
	localStorage.setItem('finger_auth', 1);
}

var setUnFingerAuth = function() {
	localStorage.removeItem('finger_auth');
};

var getFingerAuth = function() {
	return localStorage.getItem('finger_auth');
}

var doFingerLock = function(cb_succ, cb_fail) {
	var fl = getFingerAuth();
	if(fl == null) {
		cb_succ();
	} else {
		FingerprintAuth.isAvailable(function(msg) {
			FingerprintAuth.encrypt({
				clientId: 'kkkkkk',
				username: 'kkkkkk',
				//userAuthRequired: true,
				//disableBackup: true,
				//encryptNoAuth: false,

			}, function(res) {
				cb_succ();
			}, function(err) {
				cb_fail(err);
			})

		}, function(err) {
			cb_fail(err);
		});
	}
}


////////////////////////////////localstorage
var isNew = function isNew() {
	var accs = window.localStorage.getItem('accs');
	if (accs == null ) {
		return true;
	}
	accs = JSON.parse(accs);
	if(accs.users == null || accs.users.length <= 0) {
		return true;
	}
	return false;
};

var newAcc = function newAcc(name, addr, chain) {
	var accs = window.localStorage.getItem('accs');
	if (accs != null) {
		var obj = JSON.parse(accs);
		obj.users.push({
			name: name,
			addr: addr,
			chain: chain,
		});
		window.localStorage.setItem('accs', JSON.stringify(obj));
	} else {
		var obj = {
			users: [{
				name: name,
				addr: addr,
				chain: chain,
			}]
		};
		window.localStorage.setItem('accs', JSON.stringify(obj));
	}
};

var getAccs = function getAccs() {
	var accs = window.localStorage.getItem('accs');
	if (accs == null) {
		return null;
	}
	return JSON.parse(accs);
};

var nameInAccs = function nameInAccs(name) {
	var accs = getAccs();
	if (accs == null) {
		return false;
	}
	for (var i = 0; i < accs.users.length; i++) {
		if (name == accs.users[i].name) {
			return true;
		}
	}
	return false;
};

var addrInAccs = function addrInAccs(addr, chain) {
	var accs = getAccs();
	if (accs == null) {
		return [false, ""];
	}
	for (var i = 0; i < accs.users.length; i++) {
		if (addr == accs.users[i].addr && chain == accs.users[i].chain) {
			return [true, accs.users[i].name];
		}
	}
	return [false, ""];
};

var getDefaultAccNamePre = function(chain) {
	if(chain == "SFT") {
		return "SFT-";
	} else if(chain == "ETH") {
		return "ETH-";
	} else if(chain == "BNB") {
		return "BSC-";
	} else if(chain == "HT") {
		return "HT-";
	} else if(chain == "MATIC") {
		return "MATIC-";
	}
}

var getDefaultAccName = function() {
	var pre = getDefaultAccNamePre(System.chain);
	var accs = getAccs();
	if (accs == null) {
		return pre + "1";
	}
	var max = 0;
	for (var i = 0; i < accs.users.length; i++) {
		if (System.chain == accs.users[i].chain && accs.users[i].name.startsWith(pre)) {
			var x = accs.users[i].name.substr(pre.length);
			if(is_int(x)) {
				x = parseInt(x);
				if(x > max) {
					max = x;
				}
			}
		}
	}
	max++;
	return pre + max;
}

var delAcc = function(addr, chain) {
	var accs = window.localStorage.getItem('accs');
	if(accs != null) {
		var obj = JSON.parse(accs);
		for(var i = 0; i < obj.users.length; i++) {
			if(obj.users[i].addr == addr && obj.users[i].chain == chain) {
				obj.users.splice(i, 1);
				break;
			}
		}
		window.localStorage.setItem('accs', JSON.stringify(obj));
	}
};

var setPriv = function setPriv(addr, priv) {
	window.localStorage.setItem('priv:' + addr, JSON.stringify({
		priv: priv
	}));
};

var getPriv = function getPriv(addr) {
	var priv = window.localStorage.getItem('priv:' + addr);
	if (priv == null) {
		return null;
	}
	var jpriv = JSON.parse(priv);
	return jpriv.priv;
};

var setPass = function setPass(addr, pass) {
	window.localStorage.setItem('pass:' + addr, pass);
};

var getPass = function getPass(addr) {
	return window.localStorage.getItem('pass:' + addr);
};

var getMnemonic = function() {
	var mne = window.localStorage.getItem('mnemonic');
	if(mne == null) {
		return null;
	}
	return JSON.parse(mne);
}

var setMnemonic = function(name, mne, pass) {
	var obj = {
		name: name,
		mne: mne,
		pass: pass
	};
	window.localStorage.setItem('mnemonic', JSON.stringify(obj));
}

var setAddrMnemonic = function(addr, mne) {
	window.localStorage.setItem('mne:' + addr, mne);
}

var getAddrMnemonic = function(addr) {
	return window.localStorage.getItem('mne:' + addr);
}

var getCurrent = function getCurrent() {
	var current = window.localStorage.getItem('curr');
	if (current == null) {
		return null;
	}
	return JSON.parse(current);
};

var delCurrent = function() {
	window.localStorage.removeItem('curr');
}

var setCurrent = function setCurrent(name, addr) {
	var obj = {
		name: name,
		addr: addr
	};
	window.localStorage.setItem('curr', JSON.stringify(obj));
};

var getActiveChain = function() {
	return window.localStorage.getItem("active_chain");
}

var setActiveChain = function(ac) {
	window.localStorage.setItem('active_chain', ac);
}

//create account
var setCreatedChain = function(ac) {
	window.localStorage.setItem('created_chain', ac);
}

var getCreatedChain = function() {
	return window.localStorage.getItem('created_chain');
}

// another name
var setAnotherName = function(name, another) {
	window.localStorage.setItem('OLINK_another_' + System.chain + "_" + name, another);
}

var getAnotherName = function(name) {
	var another = window.localStorage.getItem('OLINK_another_' + System.chain + "_" + name);
	if(another == null) {
		return "";
	}
	return another;
}

var setIndex = function(index) {
	window.localStorage.setItem('index', index)
}

var getIndex = function() {
	var a = window.localStorage.getItem('index')
	if(a == null) {
		return 0;
	}
	return a;
}

var newSent = function newSent(chain, tokenAddr, now, from, to, value, hash) {
	var txs = localStorage.getItem('txs_' + chain + '_' + tokenAddr + '_' + from);
	var jtxs = [];
	if (txs == null) {
		jtxs = [];
	} else {
		jtxs = JSON.parse(txs);
	}
	jtxs.push({
		chain: chain,
		tokenAddr: tokenAddr,
		from: from,
		time: now,
		to: to,
		value: value,
		hash: hash,
		blockNumber: 0
	});
	if(jtxs.length >= 5) {
		jtxs.splice(0, 1);
	}
	localStorage.setItem('txs_' + chain + "_" + tokenAddr + "_" + from, JSON.stringify(jtxs));
};

var getSents = function getSents(chain, tokenAddr, from) {
	var txs = localStorage.getItem('txs_' + chain + '_' + tokenAddr + '_' + from);
	if (txs == null) {
		return [];
	}
	var jtxs = JSON.parse(txs);
	var len = jtxs.length;
	var list = [];
	for (var i = jtxs.length - 1; i >= 0; i--) {
		list.push(jtxs[i]);
	}
	return list;
};

var setHash = function(hash) {
	localStorage.setItem('hash:' + hash, '1');
};

var getHash = function(hash) {
	return localStorage.getItem('hash:' + hash);
};

var newAddrBook = function(name, memo, addrList) {
	var books = window.localStorage.getItem('books');
	if (books != null) {
		var obj = JSON.parse(books);
		obj.books.push({
			name: name,
			memo: memo,
			addrs: addrList,
		});
		window.localStorage.setItem('books', JSON.stringify(obj));
	} else {
		var obj = {
			books: [{
				name: name,
				memo: memo,
				addrs: addrList,
			}]
		};
		window.localStorage.setItem('books', JSON.stringify(obj));
	}
};

var delAddrBook = function(i) {
	var books = window.localStorage.getItem('books');
	if (books != null) {
		var obj = JSON.parse(books);
		if(i < obj.books.length) {
			obj.books.splice(i, 1);
		}
		window.localStorage.setItem('books', JSON.stringify(obj));
	}
}

var setAddrBook = function(i, name, memo, addrList) {
	var books = window.localStorage.getItem('books');
	if (books != null) {
		var obj = JSON.parse(books);

		obj.books[i].name = name;
		obj.books[i].memo = memo;
		obj.books[i].addrs = addrList;

		window.localStorage.setItem('books', JSON.stringify(obj));
	}
}

var getAddrBooks = function() {
	var books = window.localStorage.getItem('books');
	if (books == null) {
		return null;
	}
	return JSON.parse(books);
};

var newAddrForAddrBook = function(chain, addr, memo, fillIn) {
	var addrToBooks = window.localStorage.getItem("addrList_for_books");
	if (addrToBooks != null) {
		var obj = JSON.parse(addrToBooks);
		obj.addrList.push({
			chain: chain,
			addr: addr,
			memo: memo,
			fillIn: fillIn,
		});
		window.localStorage.setItem('addrList_for_books', JSON.stringify(obj));
	} else {
		var obj = {
			addrList: [{
				chain: chain,
				addr: addr,
				memo: memo,
				fillIn: fillIn,
			}]
		};
		window.localStorage.setItem('addrList_for_books', JSON.stringify(obj));
	}
}

var delAddrForAddrBook = function(i) {
	var addrToBooks = window.localStorage.getItem("addrList_for_books");
	if(addrToBooks != null) {
		var obj = JSON.parse(addrToBooks);
		if(i < obj.addrList.length) {
			obj.addrList.splice(i, 1);
			window.localStorage.setItem('addrList_for_books', JSON.stringify(obj));
		}
	}
}

var getAddrForAddrBook = function() {
	return window.localStorage.getItem('addrList_for_books');
}

var removeAddrForAddrBook = function() {
	window.localStorage.removeItem('addrList_for_books');
}

var setAddrForAddrBook = function(addrList) {
	window.localStorage.setItem('addrList_for_books', JSON.stringify({
		addrList: addrList,
	}));
}

var setParamAddrBook = function(i, name, memo) {
	var obj = {
		index: i,
		name: name,
		memo: memo,
	}
	window.localStorage.setItem('param_addrbook', JSON.stringify(obj));
}

var getParamAddrBook = function() {
	return window.localStorage.getItem('param_addrbook');
}

var removeParamAddrBook = function() {
	window.localStorage.removeItem('param_addrbook');
}


var setNewDelBookPage = function(name, addr, memo) {
	window.localStorage.setItem('del_book_page', JSON.stringify({
		name: name,
		addr: addr,
		memo: memo
	}));
}

var getDelBookPage = function() {
	var item = window.localStorage.getItem('del_book_page');
	if(item == null) {
		return {
			name: "",
			addr: "",
			memo: "",
		}
	}
	return JSON.parse(item);
}

var setDelBookPage = function(addr, memo) {
	var item = window.localStorage.getItem('del_book_page');
	if(item != null) {
		item = JSON.parse(item);
		item.addr = addr;
		item.memo = memo;
		window.localStorage.setItem('del_book_page', JSON.stringify(item));
	}
}


//////
var getVersion = function() {
	return 20204;
}

var parseVersion = function(v) {
	var tmp = parseInt(v);
	var c = tmp % 100;
	tmp = parseInt(tmp / 100);
	var b = tmp % 100;
	tmp = parseInt(tmp / 100);
	var a = tmp % 100;
	return a + "." + b + "." + c
}

var get_rpc_url = function() {
	if(System.chain == "ETH") {
		return "https://web3.mytokenpocket.vip"
		//return "https://data-seed-prebsc-1-s1.binance.org:8545/"
	} else if(System.chain == "SFT") {
		return "http://43.198.91.241/"
	} else if(System.chain == "BNB") {
		return "https://bsc-dataseed4.ninicoin.io"
		//return "https://bsc-testnet.publicnode.com"
	} else if(System.chain == "HT") {
		return "https://heco.mytokenpocket.vip"
	} else if(System.chain == "MATIC") {
		return "https://polygon-rpc.com/";
	}
}

var get_chainID = function() {
	if(System.chain == "ETH") {
		//return 1;
		return 1;
	} else if(System.chain == "SFT") {
		return 237;
		//return 100;
	} else if(System.chain == "BNB") {
		return 56;
		//return 97;
	} else if(System.chain == "HT") {
		return 128;
	} else if(System.chain == "MATIC") {
		return 137;
	}
}

var get_chainSymbol = function() {
	if(System.chain == "ETH") {
		//return 1;
		return "ETH";
	} else if(System.chain == "SFT") {
		return "SFT";
	} else if(System.chain == "BNB") {
		return "BNB";
	} else if(System.chain == "HT") {
		return "HT";
	} else if(System.chain == "MATIC") {
		return "MATIC";
	}
}

var get_chainImg = function() {
	if(System.chain == "ETH") {
		//return 1;
		return "image/e_14.png";
	} else if(System.chain == "SFT") {
		return "image/e_76.png";
	} else if(System.chain == "BNB") {
		return "image/e_12.png";
	} else if(System.chain == "HT") {
		return "image/e_75.png";
	} else if(System.chain == "MATIC") {
		return "image/Matic.png";
	}
}

var get_chainName = function(chain) {
	if(chain == "SFT") {
		return lan.LAB_ETHG_ADDADDRBOOK_ETHG;
	} else if(chain == "ETH") {
		return lan.LAB_ETHG_ADDADDRBOOK_ETH;
	} else if(chain == "BNB") {
		return lan.LAB_ETHG_ADDADDRBOOK_BNB;
	} else if(chain == "HT") {
		return lan.LAB_ETHG_ADDADDRBOOK_HT;
	} else if(chain == "MATIC") {
		return lan.LAB_ETHG_ADDADDRBOOK_MATIC;
	}
}

var rpc_core_dapp = function (method, params, cb_succ, cb_fail) {
	if(method == "eth_estimateGas") {
		cb_succ("0x1");
	} else if(method == "eth_getTransactionCount") {
		cb_succ("0x1");
	} else if(method == "eth_sendTransaction") {
		contractSend(params[0].from, params[0].to, params[0].value, params[0].data, params[0].gasPrice, System.priv, function(data) {
			// var func = args[args.length - 1].callSucc;
			// self.executeScript({
			// 	code: `${func}('${data.result}')`
			// });
			cb_succ(data);
		}, function(err) {
			cb_fail(err);
		});
	} else {
		axios.post(get_rpc_url(), JSON.stringify({
			"jsonrpc": "2.0",
			"id": method,
			"method": method,
			"params": params
		}), {
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		}).then(function (data) {
			if(data.data.error) {
				// if(data.data.error == "insufficient funds for gas * price + value") {
				// 	cb_fail(lan.LAB_NO_MUCH_BALANCE);
				// } else {
				cb_fail(data.data.error);
				//}
			} else {
				cb_succ(data.data.result);
			}
		}).catch(function(err) {
			cb_fail(err);
		})
	}
};

var rpc_core = function (method, params, cb_succ, cb_fail) {
	axios.post(get_rpc_url(), JSON.stringify({
		"jsonrpc": "2.0",
		"id": method,
		"method": method,
		"params": params
	}), {
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		}
	}).then(function (data) {
		if(data.data.error) {
			cb_fail(data.data.error.message);
		} else {
			cb_succ(data.data.result);
		}
	}).catch(function(data) {
		cb_fail("network error.");
	})
};

var rpc_blockNumber = function (cb_succ, cb_fail) {
	rpc_core("eth_blockNumber", [], cb_succ, cb_fail);
};

var rpc_getBalance = function (addr, cb_succ, cb_fail) {
	rpc_core("eth_getBalance", [addr, "latest"], cb_succ, cb_fail);
};

var rpc_sendtransaction = function (from, to, value, gas, gasPrice, cb_succ, cb_fail) {
	rpc_core("eth_sendTransaction", [{"from": from, "to": to, "value": value, "gas": gas, "gasPrice": gasPrice }], cb_succ, cb_fail);
};

var rpc_getTransactionCount = function (addr, cb_succ, cb_fail) {
	rpc_core("eth_getTransactionCount", [addr, "latest"], cb_succ, cb_fail);
};

var rpc_gasPrice = function (cb_succ, cb_fail) {
	rpc_core("eth_gasPrice", [], cb_succ, cb_fail);
};

var rpc_gasLimit = function (from, to, value, data, cb_succ, cb_fail) {
	rpc_core("eth_estimateGas", [{"from": from, "to": to, "value": value, "data": data}], cb_succ, cb_fail);
};

var rpc_sendRawTransaction = function (sign, cb_succ, cb_fail) {
	// doFingerLock(function() {
		rpc_core("eth_sendRawTransaction", [sign], cb_succ, cb_fail);
	// }, function(err_finger) {
	// 	cb_fail(err_finger);
	// })
};

var rpc_getTransaction = function (hash, cb_succ, cb_fail) {
	rpc_core("eth_getTransactionByHash", [hash], cb_succ, cb_fail);
};

var rpc_getTransactionReceipt = function (hash, cb_succ, cb_fail) {
	rpc_core("eth_getTransactionReceipt", [hash], cb_succ, cb_fail);
};

var rpc_ethCall = function(to, data, cb_succ, cb_fail) {
	rpc_core("eth_call", [{to: to, data: data}, "latest"], cb_succ, cb_fail);
};

var get_proxy_url = function() {
	//return "https://www.etherumgold.me/";
	return "http://43.198.91.241/"
};

var proxy_core = function(path, param, cb_succ, cb_fail) {
	if(window.XMLHttpRequest) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", get_proxy_url() + path + "?" + param);
        httpRequest.setRequestHeader("Content-Type", "application/json")
        var data = JSON.stringify(param);
      	httpRequest.send(data);
      	httpRequest.onreadystatechange = function() {
        	if(httpRequest.readyState == 4 && httpRequest.status == 200) {
          		console.log(httpRequest.responseText);
          		var obj = JSON.parse(httpRequest.responseText);
          		if(path == "/api/getTransactionReceipt" || path == "/api/getTransaction") {
          			cb_succ(obj);
          		} else {
	          		if(obj.code != 0) {
	          			cb_fail(obj.msg);
	          		} else {
	          			cb_succ(obj);
	          		}
	          	}
        	}
      	};
    } else {
      	cb_fail("network error");
    }
};

var proxyTxs = function(addr, pageIndex, pageCount, cb_succ, cb_fail) {
	proxy_core("/api/txs", "addr=" + addr + "&pageIndex=" + pageIndex + "&pageCount=" + pageCount, cb_succ, cb_fail);
}

var proxyVersion = function(cb_succ, cb_fail) {
	proxy_core("/api/version", "", cb_succ, cb_fail);
}

var proxyEvent = function(addr, cb_succ, cb_fail) {
	proxy_core("/api/getV5Event", "addr=" + addr, cb_succ, cb_fail);
}

var proxyAnonce = function(lang, cb_succ, cb_fail) {
	proxy_core("/api/getAnonce", "lang=" + lang, cb_succ, cb_fail);
}

var proxyGetLogs = function(lang, pageIndex, pageCount, cb_succ, cb_fail) {
	proxy_core("/api/getLogs", "lang=" + lang + "&pageIndex=" + pageIndex + "&pageCount=" + pageCount, cb_succ, cb_fail);
}

var proxyErcAddrsCount = function(token, cb_succ, cb_fail) {
	proxy_core("/api/erc20AddrsCount", "token=" + token, cb_succ, cb_fail);
}

var proxyErcTxs = function(addr, token, cb_succ, cb_fail) {
	proxy_core("/api/getErc20Txs", "addr=0x000000000000000000000000" + addr.substr(2) + "&token=" + token, cb_succ, cb_fail);
}

var proxyNftByOwner = function(erc, user, pageIndex, pageCount, cb_succ, cb_fail) {
	proxy_core("/api/nftByOwner", "erc=" + erc + "&user=0x000000000000000000000000" + user.substr(2) + "&pageIndex=" + pageIndex + "&pageCount=" + pageCount, cb_succ, cb_fail);
}

var proxyLogList = function(lang, pageIndex, pageCount, cb_succ, cb_fail) {
    proxy_core("/api/getLogs", "lang=" + lang + "&pageIndex=" + pageIndex + "&pageCount=" + pageCount, cb_succ, cb_fail);
}

var proxyGetPrice = function(symbol, cb_succ, cb_fail) {
	proxy_core("/api/getPrice", "symbol=" + symbol, cb_succ, cb_fail);
}

////////////////////////////////////
var getLocalTime = function(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString();
};

var getNowTime = function() {
	return new Date().toLocaleString();
};

var getDay = function(nS) {
	var t = new Date(parseInt(nS) * 1000);
	var year = t.getFullYear();
	var month = t.getMonth() + 1;
	var day = t.getDate();
	return year + "-" + month + "-" + day
};

var getTime = function(nS) {
	var t = new Date(parseInt(nS) * 1000);
	var hour = t.getHours();
	if(hour < 10) {
		hour = "0" + hour;
	}
	var minute = t.getMinutes();
	if(minute < 10) {
		minute = "0" + minute;
	}
	var second = t.getSeconds();
	if(second < 10) {
		second = "0" + second;
	}
	return hour + ":" + minute + ":" + second
}

var getLocalTimeBrev = function(nS) {
	var t = new Date(parseInt(nS) * 1000);
	var year = t.getFullYear();
	var month = t.getMonth() + 1;

	var day = t.getDate();

	var hour = t.getHours();
	if(hour < 10) {
		hour = "0" + hour;
	}
	var minute = t.getMinutes();
	if(minute < 10) {
		minute = "0" + minute;
	}

	return year + "-" + month + "-" + day + " " + hour + ":" + minute
}

////////////////////////////////////
///////////////bignumber
var convertFromAmount = function(data) {
	var tmp = new BigNumber(data);
	tmp = tmp / 1e+18;
	return tmp.toString();
};

var convertFromGasPrice = function(data) {
	var tmp = new BigNumber(data);
	tmp = tmp / 1e+9;
	return tmp.toString();
};

var convertBigNumber = function(data, hex) {
	var tmp = new BigNumber(data);
	if (hex) {
		return "0x" + tmp.toString(16);
	} else {
		return tmp.toString();
	}
};

var convertToGasPrice = function(data, hex) {
	var tmp = new BigNumber(data);
	tmp = tmp * 1e+9;
	if (hex) {
		return "0x" + tmp.toString(16);
	} else {
		return tmp.toString();
	}
};

var convertToAmount = function(data, hex, decimal) {
	if(decimal == null) {
		var tmp = new BigNumber(data);
		tmp = tmp * 1e+18;
		if (hex) {
			return "0x" + tmp.toString(16);
		} else {
			return tmp.toString();
		}
	} else {
		var tmp = new BigNumber(data);
		tmp = tmp * (10 ** decimal);
		if (hex) {
			return "0x" + tmp.toString(16);
		} else {
			return tmp.toString();
		}
	}
};


var getNow = function() {
	var now = Date.parse(new Date()) / 1000;
	return now;
};

var formatPriv = function(priv) {
	//return priv.replace(/(.{4})/g,'$1 ');
	return priv;
}

var lessAddr = function(addr, l) {
	if(addr == "") {
		addr = "0x0000000000000000000000000000000000000000";
	}
	//return addr.substr(2, l) + "..."
	var x = Base58.fromAddr(addr);
	return x.substr(0, l) + "..." + x.substr(x.length - 5);
}

var lessTokenId = function(tokenId, l) {
	return tokenId.substr(0, l) + "..." + tokenId.substr(tokenId.length - 5);
}

var lessAddrForTx = function(addr, symbol, l) {
	var as = addr.split('-');
	return Base58.fromAddr(as[as.length - 1]).substr(0, l) + "..."
}

var readCore = function(fileReader, cb) {
	var reader = new FileReader();
	reader.onloadend = function(e) {
		cb(e.target.result)
	}
	reader.readAsText(fileReader);
}

var hashInTxs = function(hash, txs) {
	var res = false;
	for(var i = 0; i < txs.length; i++) {
		if(txs[i].hash == hash) {
			return true;
		}
	}
	return false;
}

var showAmount = function(data, decimal) {
	if(decimal == null) {
		var ban = new BigNumber(data)
		ban = ban / (1e+18)
		return parseFloat(ban.toFixed(4));
	} else {
		var ban = new BigNumber(data);
		ban = ban / (10 ** decimal);
		return parseFloat(ban.toFixed(4));
	}
}

var showId = function(data) {
	var x = new BigNumber(data);
	return x.toString();
}

///
var changeLang = function() {
	var mylang = getLanguage();

	$(".lang").each(function(index, element) {
		$(this).text(mylang[$(this).attr("key")]);
	});

	$(".lang_html").each(function(index, element) {
		$(this).html(mylang[$(this).attr("key")]);
	});

	$(".lang_text").each(function(index, element) {
		$(this).attr('placeholder', mylang[$(this).attr("key")]);
	});

	$(".lang_img").each(function(index, element) {
		$(this).attr('src', mylang[$(this).attr("key")]);
	});
}

var setLanguage = function(lang) {
	if(lang == 'en') {
		localStorage.setItem('language', 'en');
	} else if(lang == "ch"){
		localStorage.setItem('language', 'ch');
	} else if(lang == "fr") {
		localStorage.setItem('language', 'fr');
	} else if(lang == "jp") {
		localStorage.setItem('language', 'jp');
	} else if(lang == "ko") {
		localStorage.setItem('language', 'ko');
	} else if(lang == "vi") {
		localStorage.setItem('language', 'vi');
	}
	changeLang();
}

var setLanguageIndex = function() {
	var lang = localStorage.getItem('language');
	if(lang == null) {
		localStorage.setItem('language', 'ch');
	}
	if(lang == 'en') {
		localStorage.setItem('language', 'ch');
	} else {
		localStorage.setItem('language', 'en');
	}
	changeLang();
}

var getLanguage = function() {
	var lang = localStorage.getItem('language');
	if(lang == null) {
		return lang_en;
	}
	if(lang == 'en') {
		return lang_en;
	} else if(lang == 'ch') {
		return lang_ch;
	} else if(lang == 'fr') {
		return lang_fr;
	} else if(lang == 'jp') {
		return lang_jp;
	} else if(lang == 'ko') {
		return lang_ko;
	} else if(lang == 'vi') {
		return lang_vi;
	}
}

var showAddr = function(symbol, addr) {
	return symbol + "-" + addr;
}

var getAddr = function(addr) {
	var as = addr.split('-');
	var an = Base58.toAddr(as[as.length - 1]);
	return an;
}

var validateAddr = function(symbol, addr) {
	var an = Base58.toAddr(addr);
	if(!is_eth_addr(an)) {
		return false;
	}
	return true;
}

var sameAddr = function(x, y) {
	if(Base58.fromAddr(x) == Base58.fromAddr(y)) {
		return true;
	}
	return false;
}

///// in app browser
var getInAppData = function() {
	var data = localStorage.getItem("olink-in-app");
	if(data == null) {
		return null;
	}
	return JSON.parse(data);
}

var inAppSaves = function(router, saves) {
	var ret = false;
	for(var i = 0; i < saves.length; i++) {
		if(router == saves[i].router) {
			ret = true;
			break;
		}
	}
	return ret;
}

var inAppViews = function(router, views) {
	var ret = false;
	for(var i = 0; i < views.length; i++) {
		if(router == views[i].router) {
			ret = true;
			break;
		}
	}
	return ret;
}

var newInAppSave = function(router) {
	var data = getInAppData();
	if(data == null) {
		data = {
			saves: [{
				title: '',
				router: router
			}],
			views: []
		}
		localStorage.setItem("olink-in-app", JSON.stringify(data));
		return true;
	} else {
		if(!inAppSaves(router, data.saves)) {
			data.saves.push({
				title: '',
				router: router
			})
			localStorage.setItem("olink-in-app", JSON.stringify(data));
			return true;
		} else {
			return false;
		}
	}
};

var delInAppSave = function(router) {
	var data = getInAppData();
	if(data != null) {
		for(var i = 0; i < data.saves.length; i++) {
			if(router == data.saves[i].router) {
				data.saves.splice(i, 1);
				break;
			}
		}
		localStorage.setItem("olink-in-app", JSON.stringify(data));
	}
}

var delInAppView = function(router) {
	var data = getInAppData();
	if(data != null) {
		for(var i = 0; i < data.views.length; i++) {
			if(router == data.views[i].router) {
				data.views.splice(i, 1);
				break;
			}
		}
		localStorage.setItem("olink-in-app", JSON.stringify(data));
	}
}

var newInAppView = function(title, router, time) {
	var data = getInAppData();
	if(data == null) {
		data = {
			saves: [],
			views: [{
				title: '',
				router: router,
				time: time
			}]
		}
		localStorage.setItem("olink-in-app", JSON.stringify(data));
		return true;
	} else {
		if(!inAppViews(router, data.views)) {
			data.views.push({
				title: '',
				router: router,
				time: time
			})
			localStorage.setItem("olink-in-app", JSON.stringify(data));
			return true;
		} else {
			return false;
		}
	}
}

var setTitleByRouter = function(router, title) {
	var data = getInAppData();
	if(data != null) {
		for(var i = 0; i < data.saves.length; i++) {
			if(data.saves[i].router == router) {
				data.saves[i].title = title;
			}
		}
		for(var j = 0; j < data.views.length; j++) {
			if(data.views[j].router == router) {
				data.views[j].title = title;
			}
		}
		localStorage.setItem("olink-in-app", JSON.stringify(data))
	}
}

var delInAppViews = function() {
	var data = getInAppData();
	if(data != null) {
		data.views = [];
		localStorage.setItem("olink-in-app", JSON.stringify(data));
	}

	localStorage.setItem('know-link', JSON.stringify({links: {}}));
}

var toWebRouter = function(router) {
	if(router.startsWith("https://") || router.startsWith("http://")) {
		return router;
	} else {
		return "http://" + router;
	}
}

var brev = function(src) {
	var tmp = src.replace("https://", "").replace("http://", "");
	if(tmp.length <= 10) {
		return tmp;
	} else {
		return tmp.substr(0, 10) + "...";
	}
}

var brevLink = function(src) {
	return src.replace("https://", "").replace("http://", "");
}

var viewRouter = function(src) {
	var tmp = src;
	if((!src.startsWith("https://")) && (!src.startsWith("http://"))) {
		tmp = "http://" + src;
	}
	if(tmp.length <= 35) {
		return tmp;
	} else {
		return tmp.substr(0, 35) + "...";
	}
	return tmp;
}

var viewCompleteRouter = function(src) {
	var tmp = src;
	if((!src.startsWith("https://")) && (!src.startsWith("http://"))) {
		tmp = "http://" + src;
	}
	return tmp;
}

function slide(direction, color, slowdownfactor, hrf) {
	if(window.plugins) {
	    if (!hrf) {
	      setTimeout(function () {
	        // update the page inside this timeout
	        // document.querySelector("#title").innerHTML = direction;
	        document.querySelector("html").style.background = color;
	      }, 20);
	    }
	    // not passing in options makes the plugin fall back to the defaults defined in the JS API
	    var theOptions = {
	      'direction': direction,
	      'duration': 260,
	      'slowdownfactor' : slowdownfactor,
	      'href': hrf,
	      'fixedPixelsTop' : 0, // optional, the number of pixels of your fixed header, default 0 (iOS and Android)
	      'fixedPixelsBottom': 0  // optional, the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
	    };
	    window.plugins.nativepagetransitions.slide(
	        theOptions,
	        function () {
	          //console.log('------------------- slide transition finished');
	          window.location.href = hrf;
	        },
	        function (msg) {
	          alert('error: ' + msg);
	        });
	} else {
		window.location.href = hrf;
	}
}


/////////////////////////////////////
// send common tx
var commonSend = function(from, to, amount, spriv, cb_succ, cb_fail) {
	var tx = Yoethwallet.tx;
	var wallet = Yoethwallet.wallet;
	wallet.fromPrivateKey(spriv, function (err, keystore) {
		if (err) {
			alert(err.message);
			return
		}

		var priv = keystore.getPrivateKey();
		proxyGasPrice(function(data_gasPrice) {
			proxyTransactionCount(from, function(data_count) {
				var tx = Yoethwallet.tx;
				var nl = convertBigNumber(21000, true);

				var valueTx = tx.valueTx({
					from: from,
					to: Base58.toAddr(to),
					value: amount,
					nonce: data_c.result,
					gas: nl,
					gasPrice: data_gasPrice.result,
					chainId: 708
				});

				valueTx.sign(priv);
				var signedTransaction = '0x' + valueTx.serialize().toString('hex');
				proxyRawTransaction(signedTransaction, data_count.extra, function(data_tx) {
					cb_succ(data_tx.result);
				}, function(err_tx) {
					cb_fail(err_tx)
				})
			}, function(err_count) {
				cb_fail(err_count);
			})
		}, function(err_gasPrice) {
			cb_fail(err_gasPrice);
		})
	})
}

// send contract tx
var contractSend = function(from, contractAddr, amount, data, data_gasPrice, priv, cb_succ, cb_fail) {
	var tx = Yoethwallet.tx;
	var wallet = Yoethwallet.wallet;

	// rpc_gasPrice(function(data_gasPrice) {
		rpc_getTransactionCount(from, function(data_count) {
			rpc_gasLimit(from, contractAddr, amount, data, function(data_gas) {
				
				window.showContract(contractAddr, amount, data_gasPrice, data_gas, function() {
					var tx = Yoethwallet.tx;
					var contractTx = tx.contractTx(data, {
						from: from,
						to: contractAddr,
						value: amount,
						nonce: data_count,
						gas: data_gas,
						//gas: "0x1"
						//gasPrice: data_gasPrice.result,
						gasPrice: data_gasPrice,
						chainId: get_chainID(),
					})
					contractTx.sign(priv);
					var signedTransaction = '0x' + contractTx.serialize().toString('hex');
					rpc_sendRawTransaction(signedTransaction, function(data_tx) {

						cb_succ(data_tx);
					}, function(err_tx) {
						cb_fail(err_tx)
					})
				}, function() {
					cb_fail("cancelled");
				});
			}, function(err_gas) {
				cb_fail(err_gas);
			});
		}, function(err_count) {
			cb_fail(err_count);
		})

	// }, function(err_gasPrice) {
	// 	cb_fail(err_gasPrice);
	// })

}

var contractSign = function(from, contractAddr, amount, data, priv, cb_succ, cb_fail) {
	var tx = Yoethwallet.tx;
	var wallet = Yoethwallet.wallet;

	rpc_gasPrice(function(data_gasPrice) {
			rpc_getTransactionCount(from, function(data_count) {
				rpc_gasLimit(from, contractAddr, amount, data, function(data_gas) {
						var tx = Yoethwallet.tx;
						var contractTx = tx.contractTx(data, {
							from: from,
							to: contractAddr,
							value: amount,
							nonce: data_count,
							gas: data_gas,
							//gas: "0x1"
							//gasPrice: data_gasPrice.result,
							gasPrice: data_gasPrice,
							chainId: get_chainID(),
						})
						contractTx.sign(priv);
						var signedTransaction = '0x' + contractTx.serialize().toString('hex');
						// proxyRawTransaction(signedTransaction, data_count.extra, function(data_tx) {
						// 	cb_succ(data_tx.result);
						// }, function(err_tx) {
						// 	cb_fail(err_tx)
						// })
						cb_succ(signedTransaction, data_count.extra);
				}, function(err_gas) {
					cb_fail(err_gas);
				});
			}, function(err_count) {
				cb_fail(err_count);
			})

	}, function(err_gasPrice) {
		cb_fail(err_gasPrice);
	})

}

///////////// page change config
var setPageStack = function(pageStack) {
	window.localStorage.setItem('olink_page_stack', JSON.stringify(pageStack));
}

var getPageStack = function() {
	var s = window.localStorage.getItem('olink_page_stack');
	if(s == null) {
		return []
	}
	return JSON.parse(s);
}

var clearPageStack = function() {
	window.localStorage.setItem('olink_page_stack', JSON.stringify([]));
}

var shortLink = function(oldlink, link) {
	var ret = link.split('/');
	var ret_o = oldlink.split('/')

	if(ret_o[ret_o.length - 2] == "dex" && ret.length > 1 && ret[ret.length - 2] != "dex") {
		return "../" + ret[ret.length - 1];
	} else if(ret_o.length > 1 && ret_o[ret_o.length - 2] != "dex" && ret[ret.length - 2] == "dex") {
		return "dex/" + ret[ret.length - 1];
	} else {
		return ret[ret.length - 1];
	}
	//return link;
}

var clickPagePrev = function(jump) {
	var stack = getPageStack();
	var link = stack.pop();

	if(link == null || link == "") {
		//slide('right', 'purple', 5, 'assets.html');
		window.location.href = "assets.html";
	} else {
		link = shortLink(window.location.href, link);
		setPageStack(stack);
		if(jump != true) {
			window.location.href = link;
		} else {
			slide('right', 'purple', 5, link);
		}
	}
}

var clickPagePrevDexCheckPrice = function(jump) {
	var stack = [];
	stack.push('index.html');
	setPageStack(stack);
	var link = 'index.html';
	if(jump != true) {
		window.location.href = link;
	} else {
		slide('left', 'purple', 5, link);
	}
}

var clickPageNext = function(link, jump) {
	var stack = getPageStack();
	stack.push(window.location.href);
	setPageStack(stack);
	link = shortLink(window.location.href, link);
	// if(jump) {
	// 	window.location.href = link;
	// } else {
	// 	slide('left', 'purple', 5, link);
	// }
	if(jump != true) {
		window.location.href = link;
	} else {
		slide('left', 'purple', 5, link);
	}
}

var olinkScan = function(page) {
	clickPageNext("scan.html#" + page);
}

var setTxParamTo = function(to) {
	window.localStorage.setItem('txParam_to', to);
}

var getTxParamTo = function() {
	var to = window.localStorage.getItem('txParam_to');
	if(to == null) {
		return "";
	}
	return to;
}

var clearTxParamTo = function() {
	window.localStorage.removeItem("txParam_to");
}

var setEye = function() {
	var eye = window.localStorage.getItem('eye');
	if(eye == null) {
		window.localStorage.setItem('eye', 1);
	} else {
		if(eye == 0) {
			window.localStorage.setItem('eye', 1);
		} else {
			window.localStorage.setItem('eye', 0);
		}
	}
}

var getEye = function() {
	var eye = window.localStorage.getItem('eye');
	if(eye == null) {
		return 0;
	}
	return eye;
}

var setAddrBookType = function(typ) {
	window.localStorage.setItem("AddrBookType", typ)
}

var getAddrBookType = function() {
	return window.localStorage.getItem("AddrBookType");
}

var setCurrentTokenType = function(tokenName, tokenAddr, tokenLogo, tokenDecimal) {
	var ret = {
		tokenName: tokenName,
		tokenAddr: tokenAddr,
		tokenLogo: tokenLogo,
		tokenDecimal: tokenDecimal,
	}
	window.localStorage.setItem("current_token_type", JSON.stringify(ret));
}

var getCurrentTokenType = function() {
	var ret = window.localStorage.getItem("current_token_type");
	if(ret == null) {
		return null;
	} 
	return JSON.parse(ret);
}

var setTxParamHash = function(hash) {
	window.localStorage.setItem('txParam_hash', hash);
}

var getTxParamHash = function() {
	var hash = window.localStorage.getItem('txParam_hash');
	if(hash == null) {
		return "";
	}
	return hash;
}

var setTxParamDetail = function(from, to, value, time) {
	 var ret = {
		from: from,
		to: to,
		value: value,
		time: time
	}
	window.localStorage.setItem("txParam_detail", JSON.stringify(ret));
}

var getTxParamDetail = function() {
	var ret = window.localStorage.getItem("txParam_detail");
	if(ret == null) {
		return null;
	} 
	return JSON.parse(ret);
}

var setScanPriv = function(param) {
	window.localStorage.setItem('scan_priv', param);
}

var getScanPriv = function() {
	var param = window.localStorage.getItem('scan_priv');
	if(param == null) {
		return "";
	}
	return param;
}

var clearScanPriv = function() {
	window.localStorage.removeItem('scan_priv');
}

var setScanKeys = function(param) {
	window.localStorage.setItem('scan_keys', param);
}

var getScanKeys = function() {
	var param = window.localStorage.getItem('scan_keys');
	if(param == null) {
		return "";
	}
	return param;
}

var clearScanKeys = function() {
	window.localStorage.removeItem('scan_keys');
}

var setScanToBook = function(param) {
	window.localStorage.setItem('scan_to_book', param);
}

var getScanToBook = function() {
	var param = window.localStorage.getItem('scan_to_book');
	if(param == null) {
		return "";
	}
	return param;
}

var clearScanToBook = function() {
	window.localStorage.removeItem('scan_to_book');
}

var setCopyPritKey = function(priv) {
	window.localStorage.setItem("copy_pritkey", priv);
}

var getCopyPritKey = function() {
	var param = window.localStorage.getItem("copy_pritkey");
	if(param == "") {
		return "";
	}
	return param;
}

var setOpenLink = function(link) {
	localStorage.setItem('opened_link', link);
}

var getOpenLink = function() {
	var link = localStorage.getItem('opened_link');
	if(link == null) {
		return "";
	} else {
		return link;
	}
}

var setKnowLink = function(link) {
	var ret = localStorage.getItem('know-link');
	if(ret == null) {
		ret = {
			links: {
				link: "1",
			}
		}
		localStorage.setItem('know-link', JSON.stringify(ret));
	} else {
		ret = JSON.parse(ret);
		ret.links[link] = "1";
		localStorage.setItem('know-link', JSON.stringify(ret));
	}
}

var knowLink = function(link) {
	var ret = localStorage.getItem('know-link');
	if(ret == null) {
		return false;
	}
	ret = JSON.parse(ret);
	if(ret.links[link] == "1") {
		return true;
	}
	return false;
}

//  ORC20 TOKENS
var orc20_tokens = {

}

var idtohex16 = function(id, decimal) {
	if(decimal == null) {
		var x = new BigNumber(id);
		x = x * (1e18)
		var y = x.toString(16);
		var na = "";
		var more = 64 - y.length;
		for(var i = 1; i <= more; i++ ) {
			na = "0" + na;
		}
		return na + y;
	} else {
		var x = new BigNumber(id);
		x = x * (10 ** decimal)
		var y = x.toString(16);
		var na = "";
		var more = 64 - y.length;
		for(var i = 1; i <= more; i++ ) {
			na = "0" + na;
		}
		return na + y;
	}
}

var tokenidtohex16 = function(id) {
	var y = id.substr(2);
	var na = "";
	var more = 64 - y.length;
	for(var i = 1; i <= more; i++ ) {
		na = "0" + na;
	}
	return na + y;
}

var valuetohex16 = function(val) {
	var x = new BigNumber(val);
	var y = x.toString(16);
	var na = "";
	var more = 64 - y.length;
	for(var i = 1; i <= more; i++ ) {
		na = "0" + na;
	}
	return na + y;
}

var get_erc20_balance = function(addr) {
	return "0x70a08231" + "000000000000000000000000" + addr.substr(2);
}

var gen_erc20_transfer = function(to, amount, decimal) {
	if(decimal == null) {
		return "0xa9059cbb" + "000000000000000000000000" + to.substr(2) + idtohex16(amount);
	} else {
		return "0xa9059cbb" + "000000000000000000000000" + to.substr(2) + idtohex16(amount, decimal);
	}
}

var gen_erc721_transfer = function(from, to, tokenId) {
	return "0x23b872dd" + "000000000000000000000000" + from.substr(2) + "000000000000000000000000" + to.substr(2) + tokenidtohex16(tokenId);
}

var toHex40Addr = function(addr) {
	return "0x" + addr.substr(26);
}

var calcFee = function(gasPrice, gas, e9) {
	if(e9) {
		var x = new BigNumber(gasPrice * gas);
		x /= 1e18;
		return x.toFixed(8);
	} else {
		var x = new BigNumber(gasPrice * gas);
		x /= 1e9;
		return x.toFixed(8);
	}
}

var olink_default_inapp_links = {

};

var findDefaultDapps = function(router) {
	var classifications = ["my", "hot", "bsc", "tool", "social"];
	for(var k = 0; k < classifications.length; k++) {
		for(var kj = 0; kj < olink_default_inapp_links[classifications[k]].length; kj++) {
			if(olink_default_inapp_links[classifications[k]][kj].link == router) {
				return olink_default_inapp_links[classifications[k]][kj];
			}
		}
	}
	return null;
}

var viewInDefault = function(view) {
	for(var i = 0; i < olink_default_inapp_links.length; i++) {
		if(view == olink_default_inapp_links[i].link) {
			return true;
		}
	}
	return false;
}

var default_nodes = {
	"ETH": [{
		name: "TokenTreasure",
		link: "https://web3.mytokenpocket.vip",
		speed: 145,
	}], 
	"SFT": [{
		name: "TokenTreasure",
		link: "http://54.250.176.35/",
		speed: 145,
	}, {
		name: "TokenTreasure - 1",
		link: "https://rpc.etherumgold.me/",
		speed: 169,
	}, {
		name: "TokenTreasure - 2",
		link: "https://rpc-2.etherumgold.me/",
		speed: 197,
	}, {
		name: "Ankor",
		link: "https://ethg67785.com/",
		speed: 213,
	}, {
		name: "GCCTH6",
		link: "https://rpc.mygccth6.vip/",
		speed: 415,
	}, {
		name: "pokre official",
		link: "https://pokre.info/rpc/",
		speed: 415,
	}],
	"BNB": [{
		name: "TokenTreasure",
		link: "https://bsc-dataseed4.ninicoin.io",
		speed: 150,
	}],
	"HT": [{
		name: "TokenTreasure",
		link: "https://heco.mytokenpocket.vip",
		speed: 150,
	}],
	"MATIC": [{
		name: "TokenTreasure",
		link: "https://polygon-rpc.com/",
		speed: 149,
	}]
}

var get_outer_proxy_url = function() {
	if(System.chain == "ETH") {
		return "https://api.etherscan.io/api";
	} else if(System.chain == "BNB") {
		return "https://api.bscscan.com/api";
	} else if(System.chain == "HT") {
		return "https://api.hecoinfo.com/api"
	} else if(System.chain == "MATIC") {
		return "https://api.polygonscan.com/api"
	}
}

var get_explorer_link_prev = function() {
	if(System.chain == "SFT") {
		return "https://www.etherumgold.me/explorer/tx.html#";
	} else if(System.chain == "ETH") {
		return "https://etherscan.io/tx/"
	} else if(System.chain == "BNB") {
		return "https://bscscan.com/tx/"
	} else if(System.chain == "HT") {
		return "https://hecoinfo.com/en-us/tx/"
	} else if(System.chain == "MATIC") {
		return "https://polygonscan.com/tx/"
	}
}

var get_qrcode_explorer_img = function() {
	if(System.chain == "SFT") {
		return "image/qrcode/qrcode_sft.png";
	} else if(System.chain == "ETH") {
		return "image/qrcode/qrcode_eth.png"
	} else if(System.chain == "BNB") {
		return "image/qrcode/qrcode_bnb.png"
	} else if(System.chain == "HT") {
		return "image/qrcode/qrcode_ht.png"
	} else if(System.chain == "MATIC") {
		return "image/qrcode/qrcode_matic.png"
	}
}

function out_proxy_callback(data) {
	console.log(data);
}

var outer_proxy_core = function(param, cb_succ, cb_fail) {
	if(window.XMLHttpRequest) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", get_outer_proxy_url() + "?" + param);
        httpRequest.setRequestHeader( 'Access-Control-Allow-Origin', '*');
        httpRequest.setRequestHeader("Content-Type", "application/json")
        var data = JSON.stringify(param);
      	httpRequest.send(data);
      	httpRequest.onreadystatechange = function() {

        	if(httpRequest.readyState == 4 && httpRequest.status == 200) {
          		console.log(httpRequest.responseText);
          		var obj = JSON.parse(httpRequest.responseText);

          		if(obj.status != "1") {
          			cb_fail(obj.message);
          		} else {
          			cb_succ(obj);
          		}

        	}
      	};
    } else {
      	cb_fail("连接失败");
    }

 //  	$.ajax({
 //     	url: get_outer_proxy_url() + "?" + param,
 //     	type:"GET",
 //            dataType:"jsonp",
 //            jsonp: "callback", 
 //            jsonpCallback: "out_proxy_callback", //这里的值需要和回调函数名一样
 //            contentType: "text/html",
 //            success: function(data){
 //                console.log("Script loaded and executed.");
 //            },
 //            error: function (textStatus) { //请求失败后调用的函数
 //                console.log(JSON.stringify(textStatus));
 //            }
	// }); 

	// smAjax(param);

	// axios.post(get_outer_proxy_url(), JSON.stringify(param), {
	// 	headers: {
	// 		"Accept": "application/json",
	// 		"Content-Type": "application/json"
	// 	}
	// }).then(function (data) {
	// 	// if(data.data.error) {
	// 	// 	cb_fail(data.data.error.message);
	// 	// } else {
	// 	// 	cb_succ(data.data.result);
	// 	// }
	// 	if(data.status != "1") {
	// 		cb_succ(data);
	// 	} else {
	// 		cb_succ(data.message)
	// 	}
	// }).catch(function(data) {
	// 	cb_fail("network error.");
	// })

}

var outerProxyTxs = function(addr, cb_succ, cb_fail) {
	outer_proxy_core("module=account&action=txlist&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=YourApiKeyToken&address=" + addr, cb_succ, cb_fail);
}

var outerProxyTokenTxs = function(addr, token, cb_succ, cb_fail) {
	outer_proxy_core("module=account&action=tokentx&page=1&offset=50&sort=desc&apikey=YourApiKeyToken&address=" + addr + "&contractaddress=" + token, cb_succ, cb_fail);
}

////////// add token
var newTokenToCache = function(chain, contrAddr, symbol, decimal) {
	var tokens = window.localStorage.getItem("my_tokens");
	if(tokens != null) {
		var obj = JSON.parse(tokens);
		obj.tokenList.push({
			chain: chain,
			contrAddr: contrAddr,
			symbol: symbol,
			decimal: decimal,
		});
		window.localStorage.setItem('my_tokens', JSON.stringify(obj));
	} else {
		var obj = {
			tokenList: [{
				chain: chain,
				contrAddr: contrAddr,
				symbol: symbol,
				decimal: decimal,
			}]
		};
		window.localStorage.setItem('my_tokens', JSON.stringify(obj));
	}
}

var getTokenToCache = function() {
	var tokens = window.localStorage.getItem("my_tokens");
	if(tokens == null) {
		return null;
	} else {
		return JSON.parse(tokens);
	}
}

var delTokenToCache = function(chain, token) {
	var _tokens = window.localStorage.getItem("my_tokens");
	if(_tokens != null) {
		var tokens = JSON.parse(_tokens);
		for(var i = 0; i < tokens.tokenList.length; i++) {
			if(tokens.tokenList[i].chain == chain && token == tokens.tokenList[i].contrAddr) {
				tokens.tokenList.splice(i, 1);
				break;
			}
		}
		window.localStorage.setItem('my_tokens', JSON.stringify(tokens));
	}
}

var isTokenInTokenList = function(chain, contrAddr) {
	var tokens = window.localStorage.getItem("my_tokens");
	if(tokens == null) {
		return false;
	}
	var obj = JSON.parse(tokens);
	for(var i = 0; i < obj.tokenList.length; i++) {
		if(chain == obj.tokenList[i].chain && contrAddr == obj.tokenList[i].contrAddr) {
			return true;
		}
	}
	return false;
}

var showTokenSymbol = function(symbol) {
	var x = Number("0x" + symbol.substr(128, 2));
	var s = symbol.substr(130);
	var res = "";
	for(var i = 0; i < x; i++) {
		res += String.fromCharCode(Number("0x" + s.substr(i * 2, 2)));
	}
	return res;
}

var getUsdtAddr = function() {
	if(System.chain == "ETH") {
		return "0xdac17f958d2ee523a2206206994597c13d831ec7";
	} else if(System.chain == "BNB") {
		return "0x55d398326f99059ff775485246999027b3197955";
		//return "0x4eb5e7e3291bb9b16da3556543053a3eb2ee8bc5"
	} else if(System.chain == "HT") {
		return "0xa71edc38d189767582c38a3145b5873052c3e47a";
	} else if(System.chain == "MATIC") {
		return "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
	} else if(System.chain == "SFT") {
		//return "0x8813f5bcbe6c7071d8bd32d2a4f07599bb5797b0"
		return "0xbd0e3e5fbf3d3a351f1c2bf413f67217a242345e"
	}
}

var known_routers = {
	"https://www.etherumgold.me/ethg_staking/index.html": {
		title: "Ethg Staking",
		logo: "image/LOGO/DAPPS/Staking.png"
	},
	"https://www.etherumgold.me/ethg_staking_v2/index.html": {
		title: "Ethg Staking V2",
		logo: "image/LOGO/DAPPS/Staking_v2.png"
	},
	"https://www.etherumgold.me/explorer/index.html": {
		title: "Ethg explorer",
		logo: "image/LOGO/DAPPS/Explorer.png"
	}
}

var merge_sorted_accs = function(o_accs, s_accs) {
	var n_accs = o_accs;
	n_accs.users = o_accs.users.sort(function(x, y) {
		if(x.chain < y.chain) {
			return -1;
		} else if(x.chain > y.chain) {
			return 1;
		} else {
			if(s_accs[x.chain] == null) {
				return 0;
			} else if(s_accs[x.chain][x.addr] < s_accs[x.chain][y.addr]) {
				return -1;
			} else if(s_accs[x.chain][x.addr] == s_accs[x.chain][y.addr]) {
				return 0;
			} else {
				return 1;
			}
		}
	});
	return n_accs;
}
