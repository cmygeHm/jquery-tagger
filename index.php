<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="/main.css" />
	<link rel="stylesheet" type="text/css" href="/jquery.tagger.css" />
	<script type="text/javascript" src="/jquery-1.7.2.min.js" ></script>
	<script type="text/javascript" src="/jquery.tagger.js" ></script>
	<title>jQuery.tagger.js</title>
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

</head>
<script>
$(document).ready(function(){
	$("lu").tagger();
});
</script>
<body>
Если вводим один из следующих тегов
<b>
	<ul>
		<li>Петербург</li>
		<li>Ленинград</li>
		<li>Петроградище</li>
		<li>StPetersburg</li>
		<li>Санкт-Петербург</li>
		<li>Северная Пальмира</li>
		<li>Северная Венеция</li>
		<li>Столца Культуры</li>
		<li>Северная Столица</li>
		<li>Культурная столица</li>
		<li>СПб</li>
	</ul>
</b>
, то tagger подсказывает доступные варианты. Иначе, введя запитую, tagger добавит его как новый тег.
	<form id="loginForm">
		Вводим сюда:
		<lu>
			<li>Петербург</li>
			<li>Ленинград</li>
			<li>Петроградище</li>
			<li>StPetersburg</li>
			<li>Санкт-Петербург</li>
			<li>Северная Пальмира</li>
			<li>Северная Венеция</li>
			<li>Столца Культуры</li>
			<li>Северная Столица</li>
			<li>Культурная столица</li>
			<li>СПб</li>
		</lu>
	</form>
</body>
</html>