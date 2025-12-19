import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Property extends Document {
  @Prop({ required: true })
  direccion: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true })
  num_habitaciones: number;

  @Prop({ required: true })
  tipo_operacion: string;

  @Prop({ required: true })
  nombre_cliente: string;

  @Prop({ required: true })
  email_cliente: string;

  @Prop({ default: true })
  isActive: boolean;
  
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);