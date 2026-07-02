// 勤務表入力ウィザードへのブックマークレット
//
// 使い方:
// 1. 下の WIZARD_URL を、GitHub Pagesで公開したウィザードアプリのURLに書き換える
// 2. このファイル全体を1行に圧縮し（末尾の「1行版を作る」参照）、
//    先頭に "javascript:" を付けてブラウザのブックマークとして登録する
// 3. tokyoobs-office.jp/time_card/kinmu.php を開いた状態（ログイン済み）で
//    そのブックマークをタップすると、今日の現場を抽出してウィザードに渡す
//
// 注意: kinmu.php の実際のHTML構造（テーブルのセル並び）を確認しながら
// 動作しない場合は、below の抽出ロジック（findTodayRow / extractSite）を
// 実際のページのDOMに合わせて調整してください。

(function () {
  var WIZARD_URL = "https://ryoji-tech.github.io/kinmu-wizard-/";

  function pad(n) { return String(n).padStart(2, "0"); }

  var today = new Date();
  var mm = pad(today.getMonth() + 1);
  var dd = pad(today.getDate());
  // 画面表示の "07/02" 形式に合わせる
  var dateLabel = mm + "/" + dd;
  // YYYYMMDD 形式
  var dateParam = today.getFullYear() + mm + dd;

  function findTodayRow() {
    // テーブルの行を総当たりし、日付ラベルを含む行を探す
    var rows = document.querySelectorAll("tr");
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].textContent.indexOf(dateLabel) !== -1) {
        return rows[i];
      }
    }
    return null;
  }

  function extractSite(row) {
    // 1列目=日付, 2列目=業務名 という前提。ズレる場合はここを調整。
    var cells = row.querySelectorAll("td, th");
    if (cells.length >= 2) {
      return cells[1].textContent.trim();
    }
    return "";
  }

  var row = findTodayRow();
  if (!row) {
    alert("今日（" + dateLabel + "）の行が見つかりませんでした。ページが正しく開かれているか確認してください。");
    return;
  }

  var site = extractSite(row);
  if (!site) {
    alert("現場名を取得できませんでした。手動でウィザードに入力してください。");
  }

  var url = WIZARD_URL +
    (WIZARD_URL.indexOf("?") === -1 ? "?" : "&") +
    "date=" + encodeURIComponent(dateParam) +
    "&site=" + encodeURIComponent(site || "");

  location.href = url;
})();
