import { Test, TestingModule } from '@nestjs/testing';
import { PropertyFeaturesController } from './property-features.controller';

describe('PropertyFeaturesController', () => {
  let controller: PropertyFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyFeaturesController],
    }).compile();

    controller = module.get<PropertyFeaturesController>(PropertyFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
