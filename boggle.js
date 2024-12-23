// /Users/petercharuhas/Downloads/flask-boggle/static/boggle.js

class BoggleGame {
    constructor(boardId, secs = 60) {
      this.secs = secs; // Game length
      this.score = 0;
      this.words = new Set();
      this.board = $("#" + boardId);
      this.showTimer();
  
      // Every 1000 msec, "tick"
      this.timer = setInterval(this.tick.bind(this), 1000);
      $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }
  
    showWord(word) {
      $(".words", this.board).append($("<li>", { text: word }));
    }
  
    showScore() {
      $(".score", this.board).text(this.score);
    }
  
    showMessage(msg, cls) {
      $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }
  
    async handleSubmit(evt) {
      evt.preventDefault();
      const $word = $(".word", this.board);
      const word = $word.val().trim(); // Trim whitespace
  
      if (!word) return;
  
      if (this.words.has(word)) {
        this.showMessage(`Already found: ${word}`, "err");
        return;
      }
  
      // Check server for validity
      const resp = await axios.get("/check-word", { params: { word }});
      this.processResponse(resp.data.result, word);
      $word.val("").focus();
    }
  
    processResponse(result, word) {
      if (result === "not-word") {
        this.showMessage(`${word} is not a valid English word`, "err");
      } else if (result === "not-on-board") {
        this.showMessage(`${word} is not a valid word on this board`, "err");
      } else {
        this.showWord(word);
        this.score += word.length;
        this.showScore();
        this.words.add(word);
        this.showMessage(`Added: ${word}`, "ok");
      }
    }
  
    showTimer() {
      $(".timer", this.board).text(this.secs);
    }
  
    async tick() {
      this.secs -= 1;
      this.showTimer();
  
      if (this.secs === 0) {
        clearInterval(this.timer);
        await this.scoreGame();
      }
    }
  
    async scoreGame() {
      $(".add-word", this.board).hide();
      const resp = await axios.post("/post-score", { score: this.score });
      const message = resp.data.brokeRecord ? `New record: ${this.score}` : `Final score: ${this.score}`;
      this.showMessage(message, "ok");
    }
  }