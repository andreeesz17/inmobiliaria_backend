import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Visit extends Document {
  @Prop({ required: true })
  id_casa: number;

  @Prop({ required: true })
  nombre_visitante: string;

  @Prop({ required: true })
  email_visitante: string;

  @Prop({ required: true })
  fecha_visita: Date;

  @Prop({ required: true })
  comentarios: string;

  @Prop({ required: true, default: 'scheduled' })
  estado: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);