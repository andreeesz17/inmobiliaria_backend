import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { BadRequestException } from '@nestjs/common';

describe('ImagesController', () => {
  let controller: ImagesController;
  let service: ImagesService;

  
  const mockImagesService = {
    uploadImage: jest.fn(),
    findByCasaId: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesService,
          useValue: mockImagesService,
        },
      ],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const mockResult = {
        statusCode: 201,
        message: 'Imagen registrada exitosamente',
        data: { _id: 'image-id-123', id_casa, filename: 'image.jpg' }
      };

      mockImagesService.uploadImage.mockResolvedValue(mockResult);

      const result = await controller.uploadImage(mockFile, id_casa);

      expect(result).toEqual(mockResult);
      expect(mockImagesService.uploadImage).toHaveBeenCalledWith(mockFile, id_casa);
    });

    it('debería lanzar BadRequestException cuando no se envía imagen', async () => {
      const id_casa = 1;

      await expect(controller.uploadImage(null as any, id_casa))
        .rejects
        .toThrow(BadRequestException);
      
      await expect(controller.uploadImage(null as any, id_casa))
        .rejects
        .toThrow('No se envió ninguna imagen');
    });

    it('debería lanzar BadRequestException cuando file es undefined', async () => {
      const id_casa = 1;

      await expect(controller.uploadImage(undefined as any, id_casa))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('findByCasaId', () => {
    it('debería retornar imágenes por ID de casa', async () => {
      const id_casa = 1;
      const mockImages = [
        { _id: '1', id_casa, filename: 'image1.jpg' },
        { _id: '2', id_casa, filename: 'image2.jpg' }
      ];

      const mockResult = {
        statusCode: 200,
        message: 'Imágenes obtenidas exitosamente',
        data: mockImages
      };

      mockImagesService.findByCasaId.mockResolvedValue(mockResult);

      const result = await controller.findByCasaId(id_casa);

      expect(result).toEqual(mockResult);
      expect(mockImagesService.findByCasaId).toHaveBeenCalledWith(id_casa);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las imágenes', async () => {
      const mockImages = [
        { _id: '1', id_casa: 1, filename: 'image1.jpg' },
        { _id: '2', id_casa: 2, filename: 'image2.jpg' }
      ];

      const mockResult = {
        statusCode: 200,
        message: 'Todas las imágenes obtenidas exitosamente',
        data: mockImages
      };

      mockImagesService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockImagesService.findAll).toHaveBeenCalled();
    });
  });
});
