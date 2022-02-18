var api = function (api_base) {
	return function (method, param, cb, err) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `${api_base}${method}?${param}`);
		xhr.send();
		xhr.onload = function () {
			if (this.status == 200) {
				res = JSON.parse(xhr.response);
				if (res.status === 'ok') cb(res);
				else err();
			} else err();
		};
	};
};


var ripestat = new api('https://stat.ripe.net/data/');ripestat('prefix-overview/data.json', 'max_related=114514&min_peers_seeing=0&resource=2001%3Adf6%3Ac480%3A%3A%2F48', rslt => {

var n_prefixes = rslt.see_also.filter(a => a.relation == 'more-specific').map(m => parseInt(m.resource.split('/')[1]))
		.reduce((acc, cur) => acc + 2 ** (48 - cur), 0);
	//document.getElementById('n_prefixes').innerText = n_prefixes;
}, () => {
	//document.getElementById('n_prefixes').innerText = "error loading data from RIPEstat.";
});


var list_transit_cust = document.getElementById('list_transit_cust');
var list_transit_peer = document.getElementById('list_transit_peer');
var list_transit = document.getElementById('list_transit');

ripestat('asn-neighbours/data.json', 'resource=AS57401', rslt => {
	var transit = rslt.data.neighbours.filter(n => n.type === 'left' && n.power > 5).map(n => n.asn)
		.filter(a => a !== 57401)
		.filter((i, p, s) => s.indexOf(i) == p)
		.sort((a, b) => a - b);

	var peer = rslt.data.neighbours.filter(n => (n.type === 'left' && n.power <= 5) || n.type === 'uncertain').map(n => n.asn)
		.filter(a => a !== 57401)
		.filter((i, p, s) => s.indexOf(i) == p)
		.sort((a, b) => a - b);
	
	var cust = rslt.data.neighbours.filter(n => n.type === 'right' && n.power > 5).map(n => n.asn)
		.filter(a => a !== 57401)
		.filter((i, p, s) => s.indexOf(i) == p)
		.sort((a, b) => a - b);

	var list_transit_cust = document.getElementById('list_transit_cust');
	var list_transit_peer = document.getElementById('list_transit_peer');
	var list_transit = document.getElementById('list_transit');

	/*
	document.getElementById('last_update_transit').innerText = new Date(`${rslt.data.latest_time}Z`).toLocaleString();
	document.getElementById('last_update_transit_peer').innerText = new Date(`${rslt.data.latest_time}Z`).toLocaleString();
	*/
	document.getElementById('last_update_transit_cust').innerText = new Date(`${rslt.data.latest_time}Z`).toLocaleString();
	
	
	list_transit_cust.innerHTML = '';
	list_transit_peer.innerHTML = '';
	list_transit.innerHTML = '';

	cust.forEach(asn => {
		var span = document.createElement('span');
		span.className = 'as_list_member';

		var a = document.createElement('a');
		a.innerText = `AS${asn}`;
		a.href = `https://bgp.he.net/AS${asn}`;
		a.target = '_blank';

		span.appendChild(a);
		list_transit_cust.appendChild(span);
	});
  
	peer.forEach(asn => {
		var span = document.createElement('span');
		span.className = 'as_list_member';
					
		var a = document.createElement('a');
		a.innerText = `AS${asn}`;
		a.href = `https://bgp.he.net/AS${asn}`;
		a.target = '_blank';
					
		span.appendChild(a);
		list_transit_peer.appendChild(span);
	});

	transit.forEach(asn => {
		var span = document.createElement('span');
		span.className = 'as_list_member';

		var a = document.createElement('a');
		a.innerText = `AS${asn}`;
		a.href = `https://bgp.he.net/AS${asn}`;
		a.target = '_blank';

		span.appendChild(a);
		list_transit.appendChild(span);
	});
	}, () => {
	list_transit_cust.innerText = "error loading data from RIPEstat.";
	list_transit_peer.innerText = "error loading data from RIPEstat.";
	list_transit.innerText = "error loading data from RIPEstat.";
});
