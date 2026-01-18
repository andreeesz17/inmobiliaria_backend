import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { getModelToken } from '@nestjs/mongoose';
import { Image } from './schemas/image.schema';
import { Model } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';


const mockImageModel = jest.fn().mockImplementation(function() {
  this.save = jest.fn();
  return this;
}) as any;


mockImageModel.find = jest.fn();

describe('ImagesService', () => {
  let service: ImagesService;
  let model: Model<Image>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: getModelToken(Image.name),
          useValue: mockImageModel,
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    model = module.get<Model<Image>>(getModelToken(Image.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('debería subir una imagen exitosamente', async () => {
      const mockFile = {
        filename: 'image.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/uploads/image.jpg'
      } as Express.Multer.File;

      const id_casa = 1;

      const mockSavedImage = {
        _id: 'image-id-123',
        id_casa,
        filename: 'image.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/uploads/image.jpg',
        estado: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockImageInstance = {
        save: jest.fn().mockResolvedValue(mockSavedImage)
      };

      mockImageModel.mockImplementation(() => mockImageInstance);

      
      const result = await service.uploadImage(mockFile, id_casa);

      
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Imagen registrada exitosamente',
        data: mockSavedImage
      });
      
      expect(mockImageModel).toHaveBeenCalledWith(expect.objectContaining({
        id_casa,
        filename: 'image.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/uploads/image.jpg',
        estado: 'active'
      }));
      expect(mockImageInstance.save).toHaveBeenCalled();
    });

    it('debería lanzar error cuando falla la subida', async () => {
      const mockFile = {
        filename: 'image.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/uploads/image.jpg'
      } as Express.Multer.File;

      const id_casa = 1;

      const mockImageInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      mockImageModel.mockImplementation(() => mockImageInstance);

      await expect(service.uploadImage(mockFile, id_casa)).rejects.toThrow(HttpException);
    });
  });

  describe('findByCasaId', () => {
    it('debería encontrar imágenes por ID de casa', async () => {
      const id_casa = 1;
      const mockImages = [
        { _id: '1', id_casa, filename: 'image1.jpg' },
        { _id: '2', id_casa, filename: 'image2.jpg' }
      ];

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockImages)
      };

      (mockImageModel.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.findByCasaId(id_casa);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Imágenes obtenidas exitosamente',
        data: mockImages
      });
      expect(mockImageModel.find).toHaveBeenCalledWith({ id_casa });
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('debería retornar array vacío cuando no hay imágenes', async () => {
      const id_casa = 999;
      const mockImages: any[] = [];

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockImages)
      };

      (mockImageModel.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.findByCasaId(id_casa);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Imágenes obtenidas exitosamente',
        data: []
      });
    });

    it('debería manejar errores al buscar imágenes', async () => {
      const id_casa = 1;

      const mockQuery = {
        exec: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      (mockImageModel.find as jest.Mock).mockReturnValue(mockQuery);

      await expect(service.findByCasaId(id_casa)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las imágenes', async () => {
      const mockImages = [
        { _id: '1', id_casa: 1, filename: 'image1.jpg' },
        { _id: '2', id_casa: 2, filename: 'image2.jpg' }
      ];

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockImages)
      };

      (mockImageModel.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Todas las imágenes obtenidas exitosamente',
        data: mockImages
      });
      expect(mockImageModel.find).toHaveBeenCalled();
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('debería manejar errores al obtener todas las imágenes', async () => {
      const mockQuery = {
        exec: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      (mockImageModel.find as jest.Mock).mockReturnValue(mockQuery);

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });
});
