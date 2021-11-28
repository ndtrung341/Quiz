const chapterDropdown = document.querySelector(".chapter-dropdown");
const chapterSelected = document.querySelector(".chapter-selected");
const chapterList = document.querySelector(".chapter-list");
const chapterItem = document.querySelectorAll(".chapter-item");

const quizContainer = document.querySelector(".quiz-list");

const openCloseDropdown = function (event) {
	if (!event.target.matches(".chapter-selected")) {
		chapterList.classList.remove("open");
	} else {
		chapterList.classList.toggle("open");
	}
};
window.onclick = function (e) {
	openCloseDropdown(e);
};

const shuffleArray = function (arr = []) {
	const temp = arr.slice().sort(() => Math.random() - 0.5);
	return temp;
};

const Document2Object = function (file) {
	return (
		fetch(file)
			.then((response) => response.text())
			// .then((text) => {
			// 	console.log(text.split("\n"));
			// 	return text;
			// })
			.then((text) => {
				const questions = [];
				let chap = 1;
				let content = text
					.split("\n")
					.filter((item) => item.trim() != "");
				while (content.length != 0) {
					// while (content[0].trim == "") content.shift();
					questions.push({
						chapter: chap,
						question: content.shift().split(" ").slice(2).join(" "),
						answers: [
							...content
								.splice(0, 4)
								.map((item) => item.slice(3).trim()),
						],
						correct() {
							return this.answers[0];
						},
					});
					if (content[0] == "-") {
						content.shift();
						chap++;
					}
				}
				return questions;
			})
	);
};

const renderQuiz = function (questions = [], chapter = 1) {
	quizContainer.innerHTML = "";
	const questionsFilter = questions.filter(
		(question) => question.chapter == chapter,
	);
	shuffleArray(questionsFilter).forEach((question, index) => {
		const renderAnswer = function (answers) {
			let ansList = ``;
			shuffleArray(answers).forEach((ans) => {
				ansList += `
						<button class="quiz-answer__item">${ans}</button>
					`;
			});
			return ansList;
		};

		const html = `
				<div class="quiz-item">
					<h3 class="quiz-question">
						Câu ${index + 1}: ${question.question}
					</h3>
					<div class="quiz-answer__list" data-id="${question.correct.bind(question)()}">
						${renderAnswer(question.answers)}
					</div>
			`;

		quizContainer.insertAdjacentHTML("beforeend", html);
	});
};
function renderHTML(chapter) {
	Document2Object(
		// "https://raw.githubusercontent.com/duytrungdev/TNQLHC/master/qlhc.txt",
		// "https://github.com/duytrungdev/TNQLHC/blob/master/qlhc.txt",
		"https://raw.githubusercontent.com/duytrungdev/QLHC/master/qlhc.txt",
	)
		// .then((text) => console.log(text))
		.then((text) => renderQuiz(text, chapter))
		.then(() => {
			const quizAnswers = document.querySelectorAll(".quiz-answer__item");
			quizAnswers.forEach((quizAns) => {
				quizAns.addEventListener("click", function (e) {
					if (!this.parentElement.classList.contains("done")) {
						const quizCorrect = this.parentElement.dataset.id;
						const quizChosen = this.innerHTML;
						this.classList.add(
							quizChosen == quizCorrect ? "correct" : "incorrect",
						);
						this.parentElement.classList.add("done");
						const correctTemp = [
							...this.parentElement.querySelectorAll(
								".quiz-answer__item",
							),
						].find((item) => item.innerHTML == quizCorrect);
						correctTemp != this &&
							correctTemp.classList.add("correct");
					}
				});
			});
		});
}
renderHTML(1);
chapterItem.forEach((item) => {
	item.addEventListener("click", function () {
		if (!this.classList.contains("active")) {
			const index = [...chapterItem].findIndex((item) => item == this);
			// const chapter = this.innerText.split(" ")[1];
			chapterSelected.querySelector("span").innerText = this.innerText;
			renderHTML(index + 1);
			document.documentElement.scrollTop = 0;
			chapterItem.forEach((item) => item.classList.remove("active"));
			this.classList.add("active");
		}
	});
});
