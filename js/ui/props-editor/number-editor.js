import PropsFieldWrapper from './props-field-wrapper.js';

let propsStore = {};
let draggingProps;
let draggingInput;
let lastY;

let onChange = (ev) => {
	let props = propsStore[ev.target.dataset.fieldname];
	let val = parseFloat(ev.target.value) || 0;
	props.onChange(PropsFieldWrapper.surrogateChnageEvent(cropVal(val, props)));
};

let onDoubleClick = (ev) => {
	ev.target.select();
};

let onMouseDown = (ev) => {
	if(isClickedAtRightEdge(ev)) {
		let props = propsStore[ev.target.dataset.fieldname];
		draggingInput = ev.target;
		draggingProps = props;
		lastY = ev.clientY;
	}
};

let onWheel = (ev) => {
	let props = propsStore[ev.target.dataset.fieldname];
	let d = ev.deltaY / -100;
	d *= (props.field.step || 1);
	if(ev.ctrlKey) {
		d *= 10;
	}
	deltaValue(props, ev.target, d);
	sp(ev);
}

function isClickedAtRightEdge(ev) {
	let b = ev.target.getBoundingClientRect();
	return (b.right - ev.clientX) < 20;
}

$(window).on('mousemove', (ev) => {
	if (!ev.buttons) draggingProps = undefined;
	if (!draggingProps) return;
	
	let d = Math.round((lastY - ev.clientY) / 2.001);
	if (d !== 0) {
		d = d * (draggingProps.field.step || 1);
		lastY = ev.clientY;
		if(ev.ctrlKey) {
			d *= 10;
		}
		deltaValue(draggingProps, draggingInput, d);
	}
});

function deltaValue(draggingProps, draggingInput, d) {
	let val = parseFloat(draggingInput.value);
	let croppedVal = cropVal(val + d, draggingProps);
	d = croppedVal - val;

	let e = PropsFieldWrapper.surrogateChnageEvent(croppedVal);

	draggingProps.onChange(e, true, d);
}

function cropVal(val, props) {
	if(props.field.hasOwnProperty('min')) {
		val = Math.max(val, props.field.min);
	}
	if(props.field.hasOwnProperty('max')) {
		val = Math.min(val, props.field.max);
	}
	return val;
}


let NumberEditor = (props) => {
	propsStore[props.field.name] = props;
	let step = props.field.step || 1;
	let val = Math.round(props.value / step) * step;
	assert(!isNaN(val), 'Wrong value for number editor for filed "' + props.field.name + '"');
	return R.input({
		onChange: onChange,
		disabled:props.disabled,
		value: val,
		onWheel:onWheel,
		'data-fieldname': props.field.name,
		onDoubleClick: onDoubleClick,
		onMouseDown: onMouseDown,
		type: 'number',
		lang: "en-150",
		step: props.field.step,
		min: props.field.min,
		max: props.field.max
	});
};

export default NumberEditor;