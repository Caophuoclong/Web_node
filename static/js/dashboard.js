const joinroom = (id)=>{
	const roomname = $(`#${id}`).text().trim();
	$(location).attr('href','/dashboard/'+roomname);
}

$(document).ready(()=>{
	$("#createroom").click(()=>{
		console.log('xin chao');
		const dataPost = {username: $("#username").text(),
		roomname: $("#Room_name").val()};
		console.log(dataPost.roomname);
		$.post('/dashboard/chat',dataPost,(result)=>{
			$(location).attr('href','/dashboard/'+dataPost.roomname);
		});
	})
	$(".before").hide();
	$("#chat").click(()=>{
		$(".before").show(1500);

	})
	$("#joinroom").click(()=>{
		const roomname = $("#Room_name").val();
		$(location).attr('href','/dashboard/'+roomname);
	})
	 
})