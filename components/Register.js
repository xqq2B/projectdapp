import React from 'react';
import { faker } from '@faker-js/faker';

import { useEffect, useState } from 'react';
import { client } from '../lib/sanity';
import { useContext } from 'react';
import { SocialDappContext } from '../context/SocialDappContext';

const Register = () => {
	const { formData, handleChange, currentAccount, currentUser, isAuthenticated } = useContext(SocialDappContext);
	console.log('CA', currentAccount, 'CU', currentUser,'formData', formData);
	if (!currentAccount) {
		console.log('no account')
		return (
			<></>
		)
	}
	// if(currentAccount && currentUser){
	// 	return(<></>)
	// }

	if(currentAccount && (currentUser == undefined || currentUser =='')){
	//if(currentUser || !currentAccount){

		const del = async () => {
			client.delete('93888354')
			
		}
	const handleSubmit = async () => {
		try {
			if(!formData.nameReg || !formData.imageReg){
				alert('Por favor complete todos los campos');
			}
			else{
			const userDoc =
			{
				_type: 'users',
				_id: currentAccount,
				name: formData.nameReg,
				walletAddress: currentAccount,
				imageUrl: formData.imageReg
				
			}

			
			await client.createIfNotExists(userDoc)
			alert('Usuario registrado');
			window.location.reload(true);
			}
		} catch (error) {
			//res.status(500).send({ message: 'error', data: error.message })
			console.log('guardandouser',error);
		}
		
	}

	return (
		<div className="flex justify-center px-6 my-20 container mx-auto w-[40rem] rounded-2xl p-4">
			<div className="w-full lg:w-1/2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-5 rounded-lg lg:rounded-l-none">
				<div className="px-8 mb-4 text-center">
					<h3 className="pt-4 mb-2 text-2xl text-white">REGISTRARSE</h3>
				</div>
				<form className="font-semibold px-8 pt-6 pb-8 mb-4 bg-white rounded">
					<div className="mb-4">
						<label className="block mb-2 text-sm font-bold text-gray-700" >
							Nombre completo
						</label>
						<input
							className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
							type="text"
							placeholder="Ingresa tu nombre"
							onChange={e => handleChange(e, 'nameReg')}
							required
							maxLength={50}
						/>
					</div>
					<div className="mb-4">
						<label className="block mb-2 text-sm font-bold text-gray-700" >
							Imagen de Perfil
						</label>
						<input
							className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
							type="text"
							placeholder="Url de imagen"
							onChange={e => handleChange(e, 'imageReg')}
							required
						/>
					</div>
					<div className="mb-6 text-center">
						<button
							className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
							type="button" onClick={e => handleSubmit(e)}
						>
							Registrar
						</button>

						{/* <button
							className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
							type="button" onClick={e => del(e)}
						>
							Delete
						</button> */}
					</div>
					<hr className="mb-6 border-t" />
					<div className="text-center">
						<a
							className="inline-block text-sm text-blue-500 align-baseline"

						>
							Al registrarte tendras acceso a todos los servicios de la plataforma
						</a>
					</div>
				</form>
			</div>
		</div>

	)
}
}

export default Register;