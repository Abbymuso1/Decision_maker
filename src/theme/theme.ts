import { createTheme, withTheme } from '@mui/material/styles';

const theme =  createTheme({
	palette: {
		primary : {
			// main: '#071e22' ,
			main: '#337357' ,

		},

		secondary :{
			// main: '#337357' ,
			main: '#071e22' ,


		},

		background : {
			default: '#fff', 
		}

	},
	typography: {
		h1: {
		  fontSize: 12,
		  color: '#071e22',
		  fontWeight: 'bold',
		},

		h2: {
			fontSize: 10,
			color: '#337357',
			fontWeight: 200,
		  },

		  subtitle1: {
			fontSize: 18,
			color: '#071e22',
			fontWeight: 500,
			fontStyle: 'italic',
		  },

		// body1: {
		//   fontWeight: 200,
		//   color: '#071e22',
		// },
		button: {
		  fontStyle: 'italic',
		  
		},
	  },

	
});


export default theme;