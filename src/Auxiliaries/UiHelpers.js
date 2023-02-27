export async function showErrorToast(message) {
	window.$.toast({
	  class: 'error',
	  message: message
	});
}

export async function showSuccessToast(message){
	window.$.toast({
	  class: 'success',
	  message: message
	});
	
}