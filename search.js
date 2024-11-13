$(() => {

	// 当前选中的提示选项
	var currentOption = 0;
	// 提示的选项
	const options = [
		"NOT \t非",
		"AND \t与",
		"& \t与",
		"OR \t或",
		"| \t或",
		"\"\t\"\t精确搜索",
		"(\t)\t分组",
		"ext:\t扩展名",
		"filetype:\t文件类型",
		"inanchor:\t链接中包含的关键字",
		"inbody:\t正文中包含的关键字",
		"intitle:\t标题中包含的关键字",
		"ip:\tip地址",
		"language:\t语言",
		"loc:\t位置",
		"prefer:\t偏好",
		"site:\t网站",
		"feed:\tRSS或Atom源中包含的关键字",
		"hasfeed:\t包含RSS或Atom源的网页",
		"url:\t地址中包含的关键字",
		"+\t强调",
		"-\t排除",
		"-ext:\t排除的扩展名",
		"-filetype:\t排除的文件类型",
		"-inanchor:\t排除链接中包含的关键字",
		"-inbody:\t排除正文中包含的关键字",
		"-intitle:\t排除标题中包含的关键字",
		"-ip:\t排除的ip地址",
		"-language:\t排除的语言",
		"-loc:\t排除的位置",
		"-prefer:\t排除的偏好",
		"-site:\t排除的网站",
		"-feed:\t排除的RSS或Atom源中包含",
		"-hasfeed:\t排除的包含RSS或Atom源的网页",
		"-url:\t排除地址中包含的关键字"
	]


	// 替换默认搜索框
	$("#sb_form").replaceWith(() => {
		var $div = $("<div>", {
			id: "editor",
			text: $("#sb_form_q").val()
		});

		$div.width($("#sb_form").width());

		$div.css({
			position: "fixed",
			top: "30%",
			left: "50%",
			height: "auto",
			maxHeight: "40vh",
			overflow: "auto",
			display: "inline-block",
			transform: "translate(-50%)",
			fontSize: "150%",
			zIndex: "9999",
			backgroundColor: "#000a",
			color: "#fff"
		});

		return $div;
	});

	const quill = new Quill('#editor', {
		theme: 'snow',
		modules: {
			toolbar: false
		}
	});

	$("#editor").fadeOut(0);
	quill.setSelection(quill.getLength(), 0);

	$("#editor").after($("<div id='promptBox'></div>"));
	$("#promptBox").slideUp(0);

	// 键盘事件监听
	$("html").keydown(e => {
		if (e.key === "Escape") {
			e.preventDefault();
			if ($("#promptBox").children().length === 0) {
				$("#editor").fadeToggle(300, () => {
					if ($("#editor").is(":visible")) quill.focus();
				});
			}
		} else if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if ($("#promptBox").children().length !== 0) {
				const range = quill.getSelection();
				const position = range.index;

				const textBeforeCursor = quill.getText(0, position);
				const lastWordStart = textBeforeCursor.lastIndexOf(" ") + 1;

				quill.deleteText(lastWordStart, position - lastWordStart);

				const newWord = $($(".prompt")[currentOption]).text().split("\t")[0];
				quill.insertText(lastWordStart, newWord);

				quill.setSelection(lastWordStart + newWord.length, 0);
				currentOption = 0;
				return;
			}

			window.location.href = `https://www.bing.com/search?q=${encodeURIComponent(quill.getText().trim().replace(/\s+/g, " "))}`;
			$("#editor").fadeOut(0);
		}

		if (e.key.toLowerCase() === "n" && e.altKey && $("#promptBox").children().length !== 0) {
			e.preventDefault();
			if (currentOption < $("#promptBox").children().length - 1) currentOption++;
			updateOption();
			return;
		}

		if (e.key.toLowerCase() === "p" && e.altKey && $("#promptBox").children().length !== 0) {
			e.preventDefault();
			if (currentOption > 0) currentOption--;
			updateOption();
			return;
		}

		if (e.key.toLowerCase() === "b" && e.altKey) {
			e.preventDefault();
			const range = quill.getSelection();
			const position = range.index;
			const textBeforeCursor = quill.getText(0, position);
			const lastWordStart = textBeforeCursor.replace(/\s+/g, " ").lastIndexOf(" ");
			quill.setSelection(lastWordStart, 0);
		}

		if (e.key.toLowerCase() === "f" && e.altKey) {
			e.preventDefault();
			const range = quill.getSelection();
			const position = range.index;
			const textAfterCursor = quill.getText(position);
			const firstWordStart = textAfterCursor.replace(/\s+/g, " ").indexOf(" ");
			if (firstWordStart === -1) {
				quill.setSelection(quill.getLength() - 1, 0);
			} else {
				quill.setSelection(position + firstWordStart + 1, 0);
			}
		}

		if (e.key.toLowerCase() === "a" && e.ctrlKey) {
			const range = quill.getSelection();
			if (range.length === 0) {
				e.preventDefault();
				const position = range.index;
				const textAfterCursor = quill.getText(position);
				const textBeforeCursor = quill.getText(0, position);
				const afterWord = textAfterCursor.replace(/\s+/g, " ").indexOf(" ");
				const beforeWord = textBeforeCursor.replace(/\s+/g, " ").lastIndexOf(" ");
				quill.setSelection(beforeWord + 1, position + afterWord - beforeWord - 1);
			}
		}

		if (e.key === "\"" && quill.getSelection().length !== 0) {
			e.preventDefault();
			setSymbol("\"", "\"");
		}

		if (e.key === "\"" && quill.getSelection().length === 0) {
			const range = quill.getSelection();
			const quoteCount = (quill.getText(0, range.index).match(/"/g) || []).length;
			if (quoteCount % 2 !== 0) {
				if (quill.getText(range.index, 1) === "\"") {
					e.preventDefault();
					quill.setSelection(range.index + 1, 0);
				}
			} else {
				e.preventDefault();
				quill.insertText(range.index, "\"\"");
				quill.setSelection(range.index + 1, 0);
			}
		}

		if ((e.key === "(" || e.key === ")") && quill.getSelection().length !== 0) {
			e.preventDefault();
			setSymbol("(", ")");
		}

		if (e.key === "(" && quill.getSelection().length === 0) {
			e.preventDefault();
			const range = quill.getSelection();
			quill.insertText(range.index, "()");
			quill.setSelection(range.index + 1, 0);
		}

		if (e.key === ")" && quill.getSelection().length === 0) {
			const range = quill.getSelection();
			if (((quill.getText(0, range.index).match(/\(/g) || []).length > (quill.getText(0, range.index).match(/\)/g) || []).length) && quill.getText(range.index, 1) === ")") e.preventDefault();
			quill.setSelection(range.index + 1, 0);
		}


		currentOption = 0;

		// TODO: 关键字高亮显示


	});

	quill.on('text-change', (delta, oldDelta, source) => {
		if (source === 'user') {
			delta.ops.forEach(op => {
				const range = quill.getSelection();
				if (op.delete && "(" && quill.getText(range.index, 1) === ")" && range.length === 0) quill.deleteText(range.index, 1);
				const quoteCount = (quill.getText(0, range.index).match(/"/g) || []).length;
				if (op.delete && "\"" && quoteCount % 2 === 0 && quill.getText(range.index, 1) === "\"" && range.length === 0) quill.deleteText(range.index, 1);
			});
		}
	});


	$("#editor").keyup(e => {


		updateOption();

		const range = quill.getSelection();
		if (range) {

			const bounds = quill.getBounds(range.index);
			$("#promptBox").css({
				position: "fixed",
				top: `${$('#editor')[0].getBoundingClientRect().top + bounds.top + 22}px`,
				left: `${$('#editor').offset().left + bounds.left}px`,
				width: "30vw",
				height: "auto",
				display: "inline-block",
				zIndex: "9999",
				backgroundColor: "pink",
				color: "white"
			});

		}

		if (e.key === "Escape")
			$(".prompt").remove();

	});

	// 鼠标事件监听
	$("cite").click(e => {
		if (e.ctrlKey) {
			e.preventDefault();
			const range = quill.getSelection();
			const position = range.index;
			const textBeforeCursor = quill.getText(0, position);
			var newWord = "site:" + getHostname($(e.target).text()) + " ";
			if (!quill.getText().includes(newWord)) {
				if (textBeforeCursor !== "") newWord = " " + newWord;
				quill.insertText(position, newWord);
				quill.setSelection(position + newWord.length, 0);
			} else {
				quill.setSelection(position, 0);
			}
		}
	});
	$(".b_algo").click(e => {
		if (e.ctrlKey) {
			e.preventDefault();
			const range = quill.getSelection();
			const position = range.index;
			const textBeforeCursor = quill.getText(0, position);
			var newWord = "intitle:\"" + $(e.target).text() + "\" ";
			if (!quill.getText().includes(newWord) && newWord !== "") {
				if (textBeforeCursor !== "") newWord = " " + newWord;
				quill.insertText(position, newWord);
				quill.setSelection(position + newWord.length, 0);
			} else {
				quill.setSelection(position, 0);
			}
		}
	})

	// 添加选项到提示框
	function addPrompt(string) {
		const $prompt = $(`<div class='prompt'>${string}</div>`);
		$prompt.css({
			width: "100%",
			height: "30px",
			maxHeight: "40vh",
			overflow: "auto",
			display: "inline-block",
			fontSize: "22px",
			zIndex: "9999",
			backgroundColor: "#000a",
			color: "#fff",
		});
		$("#promptBox").append($prompt);
	}

	// 更新提示框中选项
	function updateOption() {
		let lastWord = quill.getText(0, quill.getSelection().index).replace(/\n/g, " ").split(" ").at(-1);
		$(".prompt").remove();
		if (lastWord === "") return;
		options.forEach(element => {
			if (element !== lastWord && element.toLowerCase().includes(lastWord.toLowerCase()))
				addPrompt(element);
		});
		$($(".prompt")[currentOption]).css("background-color", "pink");
	}

	// 获取主机名
	function getHostname(url) {
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}
		return new URL(url).hostname;
	}

	// 设置选中文本两端符号
	function setSymbol(startSymbol, endSymbol) {
		const range = quill.getSelection();
		const selectedText = quill.getText(range.index, range.length);

		if (selectedText.startsWith(startSymbol) && selectedText.endsWith(endSymbol)) {
			const newText = selectedText.slice(1, -1);
			quill.deleteText(range.index, range.length);
			quill.insertText(range.index, newText);
			quill.setSelection(range.index, newText.length);
		} else {
			const newText = startSymbol + selectedText + endSymbol;
			quill.deleteText(range.index, range.length);
			quill.insertText(range.index, newText);
			quill.setSelection(range.index, selectedText.length + 2);
		}
	}

});
