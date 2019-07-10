const allHotkeyedButtons = [];
window.addEventListener("keydown", (ev) => {
	for(let b of allHotkeyedButtons) {
		if(b.onKeyDown(ev)) { //call only first button with this hotkey
			return;
		}
	}
});

class EditorButton extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {};
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
	}
	
	componentDidMount() {
		if(this.props.hotkey) {
			allHotkeyedButtons.unshift(this);
		}
	}
	
	componentWillUnmount() {
		let i = allHotkeyedButtons.indexOf(this);
		if(i >= 0) {
			allHotkeyedButtons.splice(i, 1);
		}
	}
	
	onKeyDown(e) {
		if(!this.props.hotkey) {
			return;
		}
		let needCtrl = this.props.hotkey > 1000;
		
		if (this.props.disabled || (window.isEventFocusOnInputElement(e) && (this.props.hotkey !== 1083)) || editor.ui.modal.isUIBlockedByModal(ReactDOM.findDOMNode(this))) return; // 1083 - Ctrl + S (Save scene)
		
		if ((e.keyCode === (this.props.hotkey % 1000)) && (needCtrl === e.ctrlKey)) {
			this.onMouseDown(e);
			sp(e);
			return true;
		}
	}
	
	onMouseDown(ev) {
		if (ev.button === 2) {
			editor.ui.modal.showModal(this.props.onClick.name, 'Button Handler:');
		} else {
			if (this.props.disabled) return;
			this.props.onClick();
			ev.target.blur();
		}
		sp(ev);
	}
	
	render() {
		return R.button({
			disabled: this.props.disabled,
			className: (this.props.disabled ? 'unclickable ' : 'clickable ') + this.props.className,
			onMouseDown: this.onMouseDown,
			title: this.props.title,
			onClick: this.onClick
		}, this.props.label);
	}
}

export default EditorButton;