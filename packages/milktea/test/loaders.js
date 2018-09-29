import { expect } from 'chai';
import loaders from '../src/loaders/loaders';

describe('loaders', function(): void{
  describe('js', function(): void{
    it('js', function(): void{
      const loadersArr: [] = loaders();
      const use: Object = loadersArr[0].use;
      const { options }: { options: Object } = use[0];
      const { plugins, presets }: { plugins: [], presets: [] } = options;

      expect(use).to.be.an('array');
      expect(options).to.be.an('object');
      expect(plugins).to.be.an('array');
      expect(presets).to.be.an('array');
    });

    it('ecmascript', function(): void{
      const loadersArr: [] = loaders({ js: { ecmascript: true } });
      const use: Object = loadersArr[0].use;
      const { options }: { options: Object } = use[0];
      const { presets }: { plugins: [], presets: [] } = options;

      expect(presets[0]).to.not.be.an('array');
    });

    it('react', function(): void{
      const loadersArr: [] = loaders({ frame: 'react', mode: 'development' });
      const use: Object = loadersArr[0].use;
      const { options }: { options: Object } = use[0];
      const { plugins, presets }: { plugins: [], presets: [] } = options;

      expect(plugins).to.include('react-hot-loader/babel');
      expect(presets).to.include('@babel/preset-react');
    });

    it('vue', function(): void{
      const loadersArr: [] = loaders({ frame: 'vue', mode: 'development' });
      const use: Object = loadersArr[0].use;
      const { options }: { options: Object } = use[0];
      const { plugins, presets }: { plugins: [], presets: [] } = options;

      expect(loadersArr[loadersArr.length - 1].use).to.eql(['vue-loader']);
      expect(plugins).to.not.include('react-hot-loader/babel');
      expect(presets).to.not.include('@babel/preset-react');
    });
  });

  describe('sass', function(): void{
    it('mode', function(): void{
      const devUse: [] = loaders({ mode: 'development' })[1].use;
      const proUse: [] = loaders({ mode: 'production' })[1].use;

      expect(devUse[2].options.outputStyle).to.equal('compact');
      expect(proUse[2].options.outputStyle).to.equal('compressed');
    });

    it('frame', function(): void{
      const reactStyleUse: [] = loaders({ mode: 'development', frame: 'react' })[1].use;
      const vueStyleOneOf: [] = loaders({ mode: 'development', frame: 'vue' })[1].oneOf;

      expect(reactStyleUse).to.include('style-loader');
      expect(vueStyleOneOf[0].use).to.include('vue-style-loader');
      expect(vueStyleOneOf[1].use).to.include('vue-style-loader');
    });
  });

  describe('less', function(): void{
    it('frame', function(): void{
      const reactStyleUse: [] = loaders({ mode: 'development', frame: 'react' })[2].use;
      const vueStyleOneOf: [] = loaders({ mode: 'development', frame: 'vue' })[2].oneOf;

      expect(reactStyleUse).to.include('style-loader');
      expect(vueStyleOneOf[0].use).to.include('vue-style-loader');
      expect(vueStyleOneOf[1].use).to.include('vue-style-loader');
    });
  });
});