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

  function findTodayDateInput() {
    // 日付は <input type="button" value="07/02(木)"> のようにボタンのvalue属性に入っている
    var candidates = document.querySelectorAll("input[type=button], input[type=submit], button");
    for (var i = 0; i < candidates.length; i++) {
      var v = (candidates[i].value || candidates[i].textContent || "").trim();
      if (v.indexOf(dateLabel) === 0) {
        return candidates[i];
      }
    }
    return null;
  }

  function extractSite(dateInput) {
    // 日付ボタンのセルより後ろで、最初に見つかった「数字だけではない」セルを業務名とみなす
    // (日付と業務名の間に、行番号らしき数字だけのセルが挟まる場合があるため)
    // 日付ボタンは <td> ではなく <th> に入っている場合があるため両方見る
    var td = dateInput.closest("td, th");
    var row = td ? td.closest("tr") : null;
    if (!td || !row) return "";
    var cells = Array.prototype.slice.call(row.querySelectorAll("td, th"));
    var idx = cells.indexOf(td);
    if (idx === -1) return "";
    for (var i = idx + 1; i < cells.length; i++) {
      var text = cells[i].textContent.trim();
      if (text && !/^\d+$/.test(text)) {
        return text;
      }
    }
    return "";
  }

  var dateInput = findTodayDateInput();
  if (!dateInput) {
    alert("今日（" + dateLabel + "）の行が見つかりませんでした。ページが正しく開かれているか確認してください。");
    return;
  }

  var site = extractSite(dateInput);
  if (!site) {
    alert("現場名を取得できませんでした。手動でウィザードに入力してください。");
  }

  var url = WIZARD_URL +
    (WIZARD_URL.indexOf("?") === -1 ? "?" : "&") +
    "date=" + encodeURIComponent(dateParam) +
    "&site=" + encodeURIComponent(site || "");

  location.href = url;
})();
