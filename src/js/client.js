import React, { Component } from 'react'
import { render, findDOMNode } from 'react-dom'
import { Provider, connect } from 'react-redux' 
import { createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

const actionGet = () => {
	return (dispatch, getState)=>{
		axios.get('http://localhost:3000/api/persona')
		.then((res)=>{
			console.log(res.data)
			dispatch({type: 'GET', payload: res.data})
		})
	}
}


const actionAdd = (nombre, edad) => {
	return (dispatch, getState) => {
		axios.post('http://localhost:3000/api/persona', {nombre: nombre, edad: edad})
		store.dispatch({type: 'POST'})
	}
}


const lista = { lista: [{nombre: 'Juanito', edad: 34}], estado: false}

const reducer = (state = lista, action) => {
	switch(action.type){
		case 'GET':
			return {...state, lista: action.payload, estado: false}
		case 'POST':
			return {...state, estado: true}	
		default:
			return state
	}
}

const store = createStore(reducer, applyMiddleware(thunk))


function mapStateToProps(state, props){
	return {
		personas: state.lista,
		estado: state.estado
	}
}



@connect(mapStateToProps, {actionGet, actionAdd})
class App extends Component{


	componentWillMount(){
		console.log("montando componente")
		this.props.actionGet();
	}

	agregar(){
		let nombre = findDOMNode(this.refs.nombre).value;
		let edad = findDOMNode(this.refs.edad).value;
		this.props.actionAdd(nombre, edad)
		findDOMNode(this.refs.nombre).value = "";
		findDOMNode(this.refs.edad).value = null;
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps.estado)
	    if (nextProps.estado){
	    	this.props.actionGet();
	    }
    }

	render(){
		return <div>
			{this.props.personas.map((person)=>{
				if(person.nombre != null){
					return <li key={person._id}>{person.nombre}</li>
				}
			})}

			<input type="text" ref="nombre" placeholder="nombre"/>
			<input type="number" ref="edad" placeholder="edad"/>
			<button onClick={this.agregar.bind(this)}>agregar</button>
		</div>
	}
}

render(
	<Provider store={store}>
		<App/>
	</Provider>
	, document.getElementById('app'))