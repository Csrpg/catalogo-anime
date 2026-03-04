import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No se devuelve en consultas por defecto
    },
    rol: {
      type: String,
      enum: ['usuario', 'admin'],
      default: 'usuario',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ---- Hook: hashear contraseña antes de guardar 

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(5);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---- Método: comparar contraseña introducida con la guardada 

usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.password);
};

// ---- Método: ocultar contraseña al serializar a JSON 

usuarioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Usuario', usuarioSchema);