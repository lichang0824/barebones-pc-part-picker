import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

const CPUSchema = new mongoose.Schema({
	name: String,
	brand: String,
	release_year: Number,
	cores: Number,
	threads: Number,
	hyperthreading: Boolean,
	hybrid: Boolean,
	architecture: String, 
	PCIe_generation: String, 
	memory_type: [String],
	base_clock: String,
	boost_clock: String,
	TDP: Number,
	unlocked: Boolean,
	iGP: Boolean, 
	MSRP: Number, 
	required_chipset: [String]
});

const MotherboardSchema = new mongoose.Schema({
	name: String, 
	brand: String, 
	chipset: String, 
	memory_type: String, 
	PCIe_generation: String, 
	wifi: Boolean, 
	m_2: Number, 
	form_factor: String, 
	MSRP: Number
});

const RAMSchema = new mongoose.Schema({
	name: String, 
	brand: String, 
	type: String, 
	size: String, 
	speed: String, 
	latency: String, 
	MSRP: Number
});

const DiskSchema = new mongoose.Schema({
	name: String, 
	brand: String, 
	solid_state: Boolean, 
	form_factor: String, 
	capacity: String, 
	protocol: String, 
	MSRP: Number
});

const CoolerSchema = new mongoose.Schema({
	name: String, 
	brand: String, 
	water: Boolean, 
	fans: Number, 
	fan_size: Number, 
	MSRP: Number
});

const GraphicsCardSchema = new mongoose.Schema({
	name: String, 
	brand: String, 
	release_year: Number, 
	architecture: String, 
	GPU: String, 
	PCIe_generation: String, 
	PCIe_lanes: Number, 
	memory_type: String, 
	memory_size: String, 
	bus_width: Number, 
	core_count: Number, 
	GPU_clock: String, 
	memory_clock: String, 
	TDP: Number, 
	MSRP: Number
});

const PSUSchema = new mongoose.Schema({
	name: String, 
	brand: String, 
	efficiency: String, 
	power: Number, 
	modular: Boolean, 
	MSRP: Number
});

const CaseSchema = new mongoose.Schema({
	name: String, 
	brand: String, 
	form_factor: String,
	MSRP: Number
});

// a PC object will have subdocuments that uses one of the component types.

const PCSchema = new mongoose.Schema({
	name: String, 
	CPU: {type: mongoose.Schema.Types.ObjectId, ref: 'CPU'}, 
	motherboard: {type: mongoose.Schema.Types.ObjectId, ref: 'Motherboard'}, 
	RAM: {type: mongoose.Schema.Types.ObjectId, ref: 'RAM'}, 
	disk: {type: mongoose.Schema.Types.ObjectId, ref: 'Disk'}, 
	cooler: {type: mongoose.Schema.Types.ObjectId, ref: 'Cooler'}, 
	GraphicsCard: {type: mongoose.Schema.Types.ObjectId, ref: 'GraphicsCard'}, 
	PSU: {type: mongoose.Schema.Types.ObjectId, ref: 'PSU'}, 
	case: {type: mongoose.Schema.Types.ObjectId, ref: 'Case'}
});

const UserSchema = new mongoose.Schema({
	username: String, 
	password: {type: String, unique: true, required: true},
	pcs: [{type: mongoose.Schema.Types.ObjectId, ref: 'PC'}]
});

// register models
mongoose.model('CPU', CPUSchema);
mongoose.model('Motherboard', MotherboardSchema);
mongoose.model('RAM', RAMSchema);
mongoose.model('Disk', DiskSchema);
mongoose.model('Cooler', CoolerSchema);
mongoose.model('GraphicsCard', GraphicsCardSchema);
mongoose.model('PSU', PSUSchema);
mongoose.model('Case', CaseSchema);
mongoose.model('PC', PCSchema);
mongoose.model('User', UserSchema);

mongoose.connect(process.env.DB);
