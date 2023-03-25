export async function showErrorToast(message: string) {
	window.$.toast({
	  class: 'error',
	  message: message
	});
}

export async function showSuccessToast(message: string){
	window.$.toast({
	  class: 'success',
	  message: message
	});
	
}