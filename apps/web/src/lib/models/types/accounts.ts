export interface Account {
	id: string
	firstName: string
	middleName: string
	lastName: string
	dob: string
	gender: string
	address: Address[]
	phone: Phone[]
}

export interface Address {
	type: string
	street: string
	city: string
	state: string
	zip: string
}

export interface Phone {
	number: string
	type: string
}
