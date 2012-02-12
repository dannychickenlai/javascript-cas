Expression.prototype.real = function() {
	deprecated("hack:");
	return this.realimag()[0];
};
Expression.prototype.imag = function() {
	deprecated("hack:");
	return this.realimag()[1];
};


// ========= List ========= //
Expression.List.prototype.realimag = function() {
	switch (this.operator) {
		case undefined:
			if(this[0].apply_realimag && this.length === 2) {
				return this[0].apply_realimag(this.operator, this[1]);
			}
			throw(".realimag() method invoked for Expression without operator?");
		case '+':
		case '-':
			var a = this[0].realimag();
			var b = this[1].realimag();
			return [
				a[0].apply('+',b[0]),
				a[1].apply('+',b[1])
			];
		case '*':
			var a = this[0].realimag();
			var b = this[1].realimag();
			return [
				a[0].apply('*',b[0]).apply('-', a[1].apply('*',b[1])),
				a[0].apply('*',b[1]).apply('+',a[1].apply('*',b[0]))
			];
		case '/':
			var a = this[0].realimag();
			var b = this[1].realimag();
			var cc_dd = b[0].apply('*',b[0]).apply('+',b[1].apply('*',b[1]));
			return [
				(a[0].apply('*',b[0]).apply('+',a[1].apply('*',b[1]))).apply('/', cc_dd),
				(a[1].apply('*',b[0]).apply('-',a[0].apply('*',b[1]))).apply('/', cc_dd)
			];
		case '^':
			var a = this[0].realimag();
			var b = this[1].realimag();

			var half = new Expression.Numerical(0.5, 0);
			var hlm = half.apply('*', Global.log.apply(undefined, a[0].apply('*', a[0]).apply('+', a[1].apply('*',a[1]))));
			var theta = Global.atan2.apply(undefined, a[1], a[0]);
			var hmld_tc = hlm.apply('*', b[1]).apply('+', theta.apply('*', b[0]));
			var e_hmlc_td = Global.exp(hlm.apply('*',b[0]).apply('-', theta.apply('*', b[1])));

			return [
				(e_hmlc_td.apply('*',Math.cos(hmld_tc))),
				(e_hmlc_td.apply('*',Math.sin(hmld_tc)))
			];
	}
};